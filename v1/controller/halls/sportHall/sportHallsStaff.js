const db = require("../../../../config/db-mysql");
const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");

exports.getSportHallStaff = asyncHandler(async (req, res) => {
  const sportHall = await req.db.sportHall.findByPk(req.params.id);
  if (!sportHall) {
    throw new ErrorMsg(req.params.id + " ID-тай заал байхгүй байна.", 404);
  }
  res.status(200).json({
    success: true,
    message: "Амжилттай",
    sportHall,
  });
});

exports.updateSportHallStaff = asyncHandler(async (req, res) => {
  let sportHall = await req.db.sportHall.findByPk(req.params.id);
  if (!sportHall) {
    throw new ErrorMsg(`${req.params.id} ID-тай заал байхгүй байна!`, 404);
  }
  const {
    khorooId,
    districtId,
    title,
    price,
    phone,
    images,
    thumbnail,
  } = req.body;

  const khorooIdCheck = await req.db.khoroo.findOne({
    where: { khorooId: khorooId },
  });

  if (!khorooIdCheck) {
    throw new ErrorMsg(`${khorooId}-ID тай хороо байхгүй байна!`, 404);
  }

  const districtIdCheck = await req.db.district.findOne({
    where: { districtId: districtId },
  });

  if (!districtIdCheck) {
    throw new ErrorMsg(`${districtId}-ID тай дүүрэг байхгүй байна!`, 404);
  }

  await req.db.sportHalls_tag.destroy({ where: { hallId: req.params.id } });

  await sportHall.update({
    title: title,
    districtId: districtId,
    khorooId: khorooId,
    price: price,
    phone: phone,
    images: images,
    thumbnail: thumbnail,
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    sportHall,
  });
});

exports.getScheduleSportHall = asyncHandler(async (req, res) => {
  const findScheduleSportHall = await req.db.scheduleSportHall.findAll({
    where: { hallId: req.params.id },
  });

  const findOrderedScheduleSportHall = await req.db.orderedScheduleSportHall.findAll(
    {
      where: { hallId: req.params.id },
    }
  );

  await findScheduleSportHall.map(async (item) => {
    const checkDate = Date.now() > Date.parse(item.date);

    if (checkDate == true) {
      await req.db.scheduleSportHall.destroy({
        where: { hallid: req.params.id, date: item.date },
      });
    }
  });

  await findOrderedScheduleSportHall.map(async (item) => {
    const checkDate = Date.now() > Date.parse(item.date);

    if (checkDate == true) {
      await req.db.orderedScheduleSportHall.destroy({
        where: { hallid: req.params.id, date: item.date },
      });
    }
  });

  const scheduleSportHall = await req.db.scheduleSportHall.findAll({
    where: { hallId: req.params.id },
  });

  const orderedScheduleSportHall = await req.db.orderedScheduleSportHall.findAll(
    {
      where: { hallId: req.params.id },
    }
  );

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    scheduleSportHall,
    orderedScheduleSportHall,
  });
});

exports.createScheduleSportHall = asyncHandler(async (req, res) => {
  const { date } = req.body;

  const sportHall = await req.db.sportHall.findByPk(req.params.id);
  if (!sportHall) {
    throw new ErrorMsg(`${req.params.id} ID-тай заал байхгүй байна!`, 404);
  }

  console.log(date);

  for (var i = 0; i < date.length; i++) {
    const checkDate = await req.db.scheduleSportHall.findOne({
      where: { hallId: req.params.id, date: date[i] },
    });

    const orderDate = await req.db.orderedScheduleSportHall.findOne({
      where: { hallId: req.params.id, date: date[i] },
    });

    if (orderDate) {
      throw new ErrorMsg(
        `${date[i]} цагт энэ зааланд захиалга хийгдсэн байна.`,
        400
      );
    }

    if (!checkDate && !orderDate) {
      const parseDate = await Date.parse(date[i]);
      console.log(parseDate);
      await req.db.scheduleSportHall.create({
        hallId: req.params.id,
        date: parseDate,
      });
    }
  }

  res.status(200).json({
    success: true,
    message: "Амжилттай",
  });
});
