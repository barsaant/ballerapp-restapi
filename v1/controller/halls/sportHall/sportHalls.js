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
  res.status(200).json({
    success: true,
    message: "Амжилттай",
    sportHall,
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

exports.updateSportHall = asyncHandler(async (req, res) => {
  let sportHall = await req.db.sportHall.findByPk(req.params.id);
  if (!sportHall) {
    throw new ErrorMsg(`${req.params.id} ID-тай заал байхгүй байна!`, 404);
  }
  const { khorooId, districtId, tagId } = req.body;

  if (!districtId) {
    throw new ErrorMsg("Дүүргээ сонгоно уу!", 400);
  }

  if (!khorooId) {
    throw new ErrorMsg("Хороогоо сонгоно уу!", 400);
  }

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

  const sportHallWithTag = await req.db.sportHall.findByPk(
    req.params.id,
    tagJson
  );

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    sportHallWithTag,
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
