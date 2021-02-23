const db = require("../../../../config/db-mysql");
const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");

exports.getTagSportHalls = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  let select = req.query.select;
  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.tagSportHall);

  let query = {
    offset: pagination.start - 1,
    limit,
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

  const allTags = await req.db.tagSportHall.findAll();
  let count;
  let pages;
  for (var i = 0; i < allTags.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }

  const tags = await req.db.tagSportHall.findAll(query);

  res.status(200).json({
    success: true,
    count,
    pages,
    message: "Амжилттай",
    tags,
  });
});

exports.getTagSportHall = asyncHandler(async (req, res) => {
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

  const tagSportHall = await req.db.tagSportHall.findByPk(req.params.id);
  if (!tagSportHall) {
    throw new ErrorMsg(req.params.id + " ID-тай таг байхгүй байна.", 404);
  }

  const { tagId, tagName, createdAt, updatedAt } = tagSportHall;

  const allSportHalls = await tagSportHall.getSportHalls();

  let count;
  let pages;
  for (var i = 0; i < allSportHalls.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }

  const sportHalls = await tagSportHall.getSportHalls(query);

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    count,
    pages,
    tagSportHall: {
      tagId,
      tagName,
      createdAt,
      updatedAt,
      sportHalls,
    },
  });
});

exports.createTagSportHall = asyncHandler(async (req, res) => {
  const { tagName } = req.body;
  if (!tagName) {
    throw new ErrorMsg("Таг-н нэрийг оруулна уу!", 401);
  }

  const tagNameCheck = await req.db.tagSportHall.findOne({
    where: { tagName: tagName },
  });

  if (tagNameCheck) {
    throw new ErrorMsg(`${tagName} нэртэй таг үүссэн байна!`, 400);
  }

  const tagSportHall = await req.db.tagSportHall.create(req.body);
  res.status(200).json({
    success: true,
    message: "Амжилттай үүсгэлээ",
    tagSportHall,
  });
});

exports.updateTagSportHall = asyncHandler(async (req, res) => {
  let tagSportHall = await req.db.tagSportHall.findByPk(req.params.id);
  if (!tagSportHall) {
    throw new ErrorMsg(`${req.params.id}-тай таг байхгүй байна!`);
  }
  const { tagName } = req.body;

  if (tagName) {
    const tagNameCheck = await req.db.tagSportHall.findOne({
      where: { tagName: tagName },
    });

    if (tagNameCheck) {
      throw new ErrorMsg(`"${tagNameCheck}" нэртэй дүүрэг үүссэн байна!`, 400);
    }
  }

  await tagSportHall.update(req.body);

  res.status(200).json({
    success: true,
    message: "Амжилттай шинэчиллээ",
    tagSportHall,
  });
});

exports.deleteTagSportHall = asyncHandler(async (req, res) => {
  let tagSportHall = await req.db.tagSportHall.findByPk(req.params.id);

  if (!tagSportHall) {
    throw new ErrorMsg(`${req.params.id} ID-тай таг байхгүй байна!`);
  }

  await req.db.sportHalls_tag.destroy({ where: { tagId: req.params.id } });

  await tagSportHall.destroy();
  res.status(200).json({
    success: true,
    message: "Амжилттай устгалаа",
  });
});
