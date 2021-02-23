const db = require("../../../../config/db-mysql");
const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");

exports.getKhorooSportHalls = asyncHandler(async (req, res) => {
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

  const khoroo = await req.db.khoroo.findByPk(req.params.id);
  const { khorooId, khorooName, districtId, createdAt, updatedAt } = khoroo;
  if (!khoroo) {
    throw new ErrorMsg(req.params.id + " ID-тай хороо байхгүй байна.", 404);
  }

  const allSportHalls = await khoroo.getSportHalls();

  let count;
  let pages;
  for (var i = 0; i < allSportHalls.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }

  const sportHalls = await khoroo.getSportHalls(query);

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    count,
    pages,
    khoroo: {
      khorooId,
      khorooName,
      districtId,
      createdAt,
      updatedAt,
      sportHalls,
    },
  });
});
