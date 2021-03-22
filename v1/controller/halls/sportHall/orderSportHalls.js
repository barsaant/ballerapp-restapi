const db = require("../../../../config/db-mysql");
const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

exports.createOrderSportHall = asyncHandler(async (req, res) => {
  const { userId, date, duration, price, condition } = req.body;

  const user = await req.db.user.findByPk(userId);
  if (!user) {
    throw new ErrorMsg(`${userId} ID-тай хэрэглэгч байхгүй байна!`, 404);
  }

  const sportHall = await req.db.sportHall.findByPk(req.params.id);
  if (!sportHall) {
    throw new ErrorMsg(`${req.params.id} ID-тай заал байхгүй байна!`, 404);
  }

  const operator = await req.db.operatorSportHall.findOne({
    where: { hallId: req.params.id },
  });

  if (!operator) {
    throw new ErrorMsg(
      `${req.params.id} зааланд заалны оператор байхгүй байна`,
      404
    );
  }

  const checkDate = await req.db.scheduleSportHall.findOne({
    where: { hallId: req.params.id, date: date },
  });

  if (!checkDate) {
    throw new ErrorMsg(`${date} цагт энэ заалыг захиалах боломжгүй байна`, 400);
  }

  const parseDate = Date.parse(date);
  const endDate = parseDate + duration * 60 * 60 * 1000;

  const order = await req.db.orderSportHall.create({
    userId: userId,
    hallId: req.params.id,
    date: parseDate,
    duration: duration,
    endDate: endDate,
    price: price,
    condition: condition,
  });

  const scheduleSportHall = await req.db.scheduleSportHall.findAll({
    where: { hallId: req.params.id },
  });

  for (var i = 0; i < scheduleSportHall.length; i++) {
    const dateCheck =
      parseDate <= Date.parse(scheduleSportHall[i].date) &&
      Date.parse(scheduleSportHall[i].date) < endDate;
    if (dateCheck) {
      await req.db.orderedScheduleSportHall.create({
        hallId: scheduleSportHall[i].hallId,
        date: scheduleSportHall[i].date,
      });
      await scheduleSportHall[i].destroy();
    }
  }

  const orderName = crypto.randomBytes(15).toString("hex");
  const algorithm = "aes-256-ctr";
  const enpassword = "zqdP.-hpm3TG<WPH";

  const encryptOrderName = (orderName) => {
    var cipher = crypto.createCipher(algorithm, enpassword);
    var crypted = cipher.update(orderName, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
  };

  const encryptedOrderName = encryptOrderName(orderName);

  const salt = await bcrypt.genSalt(10);
  const bcryptOrderName = await bcrypt.hash(orderName, salt);
  await order.update({
    orderName: encryptedOrderName,
    orderPass: bcryptOrderName,
  });

  console.log(orderName);
  console.log(encryptedOrderName);
  console.log(bcryptOrderName);

  // OrderOpSportHall дотор шинээр хүсэлт үүсгэх

  // Үнийг нь авах
  let orderPrice = 0;
  console.log(condition);
  condition == "halfcourt"
    ? (orderPrice = sportHall.halfPrice)
    : (orderPrice = sportHall.price);

  await req.db.orderOpSportHall.create({
    orderId: order.orderId,
    hallId: req.params.id,
    userId: operator.userId,
    price: orderPrice,
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    order,
  });
});

exports.confirmOrderSportHall = asyncHandler(async (req, res) => {
  const order = await req.db.orderSportHall.findByPk(req.params.id);

  if (!order) {
    throw new ErrorMsg(`${req.params.id} ID-тай хүсэлт үүсээгүй байна.`, 400);
  }

  const orderOp = await req.db.orderOpSportHall.findOne({
    where: { orderId: req.params.id },
  });

  const { orderPass, userId } = req.body;

  if (order.userId.toString() !== userId) {
    throw new ErrorMsg(
      `${req.params.id} ID-тай хэрэглэгч таны хүсэлт амжилтгүй боллоо.`,
      400
    );
  }

  if (order.status == "confirmed") {
    throw new ErrorMsg(
      `${req.params.id} ID-тай хүсэлт баталгаажсан байна.`,
      400
    );
  }

  if (!orderPass) {
    throw new ErrorMsg(`Таны хүсэлт амжилтгүй боллоо.`, 400);
  }

  const check = await bcrypt.compare(orderPass, order.orderPass);

  if (!check) {
    throw new ErrorMsg(`Таны хүсэлт амжилтгүй боллоо.`, 400);
  }

  const orderToken = crypto.randomBytes(25).toString("hex");

  await order.update({ status: "confirmed", orderToken: orderToken });
  await orderOp.update({ status: "confirmed" });
  res.status(200).json({
    success: true,
    message: "Амжилттай баталгаажлаа.",
    order,
  });
});

exports.getOrderSportHalls = asyncHandler(async (req, res) => {
  const user = await req.db.user.findByPk(req.params.id);

  if (!user) {
    throw new ErrorMsg(`Хэрэглэгч олдсонгүй`, 404);
  }

  const orders = await req.db.orderSportHall.findAll({
    where: { userId: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    orders,
  });
});

exports.getOrderSportHall = asyncHandler(async (req, res) => {
  const order = await req.db.orderSportHall.findOne({
    where: { orderId: req.params.id },
  });

  if (!order) {
    throw new ErrorMsg(`${req.params.id} ID-тай хүсэлт үүсээгүй байна.`, 400);
  }

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    order,
  });
});
