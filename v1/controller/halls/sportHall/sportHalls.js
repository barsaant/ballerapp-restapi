const db = require("../../../../config/db-mysql");
const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");
const tagJson = {
  include: [
    {
      model: db.tagSportHall,
      attributes: ["tagId", "tagName", "createdAt", "updatedAt"],
      through: { attributes: [] },
    },
  ],
};

exports.getSportHalls = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  let select = req.query.select;
  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.sportHall);

  let query = {
    offset: pagination.start - 1,
    limit,
    include: [
      {
        model: db.tagSportHall,
        attributes: ["tagId", "tagName", "createdAt", "updatedAt"],
        through: { attributes: [] },
      },
    ],
  };
  if (req.query) {
    query.where = req.query;
  }

  if (select) {
    query.attributes = select;
  }

  if (sort) {
    query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "DESC" : "ASC",
      ]);
  }

  const allSportHalls = await req.db.sportHall.findAll();
  let count;
  let pages;
  for (var i = 0; i < allSportHalls.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }

  const sportHalls = await req.db.sportHall.findAll(query);

  console.log(user);

  res.status(200).json({
    success: true,
    count,
    pages,
    message: "Амжилттай",
    sportHalls,
  });
});

exports.getSportHall = asyncHandler(async (req, res) => {
  const sportHall = await req.db.sportHall.findByPk(req.params.id, tagJson);
  if (!sportHall) {
    throw new ErrorMsg(req.params.id + " ID-тай заал байхгүй байна.", 404);
  }

  const user = await req.db.operatorSportHall.findOne({
    where: { hallId: req.params.id },
  });

  const {
    hallId,
    title,
    thumbnail,
    images,
    phone,
    districtId,
    khorooid,
    address,
    lockerRoom,
    halfPrice,
    price,
    longitude,
    latitude,
    status,
    rating,
    tagSportHalls,
  } = sportHall;

  const { userId } = user;
  res.status(200).json({
    success: true,
    message: "Амжилттай",
    sportHall: {
      hallId,
      title,
      thumbnail,
      images,
      phone,
      districtId,
      khorooid,
      address,
      lockerRoom,
      halfPrice,
      price,
      longitude,
      latitude,
      status,
      rating,
      tagSportHalls,
      userId,
    },
  });
});

exports.createSportHall = asyncHandler(async (req, res) => {
  const sportHall = await req.db.sportHall.create(req.body);

  res.status(200).json({
    success: true,
    message: "Амжилттай үүсгэлээ",
    sportHall,
  });
});

exports.moveStatusSportHall = asyncHandler(async (req, res) => {
  let sportHall = await req.db.sportHall.findByPk(req.params.id);
  if (!sportHall) {
    throw new ErrorMsg(`${req.params.id} ID-тай заал байхгүй байна!`, 404);
  }

  const { status } = req.body;

  sportHall.update({ status: status });

  res.status(200).json({
    success: true,
    message: "Амжилттай устгалаа",
  });
});

exports.updateSportHall = asyncHandler(async (req, res) => {
  let sportHall = await req.db.sportHall.findByPk(req.params.id);
  if (!sportHall) {
    throw new ErrorMsg(`${req.params.id} ID-тай заал байхгүй байна!`, 404);
  }
  const { khorooId, districtId, tagId, userId } = req.body;

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

  await req.db.operatorSportHall.destroy({ where: { hallId: req.params.id } });

  await sportHall.update(req.body);

  if (tagId) {
    for (var i = 0; i < tagId.length; i++) {
      const tagIdCheck = await req.db.tagSportHall.findByPk(tagId[i]);
      if (!tagIdCheck) {
        throw new ErrorMsg(`${tagId} ID-тай таг байхгүй байна!`, 404);
      }
      await req.db.sportHalls_tag.create({
        hallId: req.params.id,
        tagId: tagId[i],
      });
    }
  }

  if (userId) {
    for (var i = 0; i < userId.length; i++) {
      const userIdCheck = await req.db.user.findByPk(userId[i]);
      if (!userIdCheck) {
        throw new ErrorMsg(`${userId} ID-тай хэрэглэгч байхгүй байна!`, 404);
      }
      await req.db.operatorSportHall.create({
        hallId: req.params.id,
        userId: userId[i],
      });
    }
  }

  const sportHallWithTag = await req.db.sportHall.findByPk(
    req.params.id,
    tagJson
  );

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    // sportHallWithTag,
    // userId,
  });
});

exports.deleteSportHall = asyncHandler(async (req, res) => {
  let sportHall = await req.db.sportHall.findByPk(req.params.id);

  if (!sportHall) {
    throw new ErrorMsg(`${req.params.id} ID-тай заал байхгүй байна!`, 404);
  }

  await req.db.sportHalls_tag.destroy({ where: { hallId: req.params.id } });
  await req.db.favoriteSportHall.destroy({ where: { hallId: req.params.id } });
  await req.db.rateSportHall.destroy({ where: { hallId: req.params.id } });

  await sportHall.destroy();
  res.status(200).json({
    success: true,
    message: "Амжилттай устгалаа",
  });
});
