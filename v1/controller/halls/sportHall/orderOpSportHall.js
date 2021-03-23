const db = require("../../../../config/db-mysql");
const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");

exports.payRequestSportHall = asyncHandler(async (req, res) => {
  const orderOp = await req.db.orderOp.findAll({
    where: { userId: req.params.id, status: "unpaid" },
  });
  const amount = 0;
  for (var i = 0; i < orderOp.length; i++) {
    amount = amount + orderOp[i].price;
    orderOp[i].update({ status: "pending" });
  }

  const payRequest = await req.db.payRequestSportHall.create({
    userId: req.params.id,
    amount: amount,
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    payRequest,
  });
});

exports.getPayRequestSportHall = asyncHandler(async (req, res) => {
  const payRequest = await req.db.payRequest.findAll({
    where: {
      userId: req.params.id,
    },
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    payRequest,
  });
});

exports.getPendingRequestSportHalls = asyncHandler(async (req, res) => {
  const payRequest = await req.db.payRequest.findAll({
    where: {
      status: "pending",
    },
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    payRequest,
  });
});

exports.getPaidRequestSportHalls = asyncHandler(async (req, res) => {
  const payRequest = await req.db.payRequest.findAll({
    where: {
      status: "paid",
    },
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    payRequest,
  });
});

exports.getPayRequestSportHalls = asyncHandler(async (req, res) => {
  const payRequest = await req.db.payRequest.findAll();

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    payRequest,
  });
});
