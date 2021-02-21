const db = require("../../../../config/db-mysql");
const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");

exports.getDistrictKhoroos = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  let select = req.query.select;
  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.khoroo);

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

  const district = await req.db.district.findByPk(req.params.id);
  const { districtId, districtName, createdAt, updatedAt } = district;
  if (!district) {
    throw new ErrorMsg(req.params.id + " ID-тай ангилал байхгүй байна.", 404);
  }
  console.log(district);
  const khoroos = await district.getKhoroos(query);

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    district: { districtId, districtName, createdAt, updatedAt, khoroos },
  });
});
