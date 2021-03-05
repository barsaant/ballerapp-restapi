const db = require("../../../../config/db-mysql");
const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");

exports.getDistricts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  let select = req.query.select;
  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.district);

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
  const allDistrict = await req.db.district.findAll();
  let count;
  let pages;
  for (var i = 0; i < allDistrict.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }

  const districts = await req.db.district.findAll(query);

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    count,
    pages,
    districts,
  });
});

exports.getDistrict = asyncHandler(async (req, res) => {
  const district = await req.db.district.findByPk(req.params.id);
  if (!district) {
    throw new ErrorMsg(req.params.id + " ID-тай дүүрэг байхгүй байна.", 404);
  }
  res.status(200).json({
    success: true,
    message: "Амжилттай",
    district,
  });
});

exports.createDistrict = asyncHandler(async (req, res) => {
  const { districtName } = req.body;
  if (!districtName) {
    throw new ErrorMsg("Дүүргийн нэрийг оруулна уу!", 400);
  }

  const districtNameCheck = await req.db.district.findOne({
    where: { districtName: districtName },
  });

  if (districtNameCheck) {
    throw new ErrorMsg(`${districtName} нэртэй дүүрэг үүссэн байна!`, 400);
  }

  const district = await req.db.district.create(req.body);
  res.status(200).json({
    success: true,
    message: "Амжилттай үүсгэлээ",
    district,
  });
});

exports.updateDistrict = asyncHandler(async (req, res) => {
  let district = await req.db.district.findByPk(req.params.id);
  if (!district) {
    throw new ErrorMsg(`${req.params.id} ID-тай дүүрэг байхгүй байна!`);
  }

  const { districtName } = req.body;

  if (!districtName) {
    throw new ErrorMsg(`Дүүргийн нэрийг оруулна уу`, 400);
  }

  const districtNameCheck = await req.db.district.findOne({
    where: { districtName: districtName },
  });

  if (districtNameCheck) {
    throw new ErrorMsg(`${districtName} нэртэй дүүрэг үүссэн байна!`, 400);
  }

  await district.update(req.body);

  res.status(200).json({
    success: true,
    message: "Амжилттай шинэчиллээ",
    district,
  });
});

exports.deleteDistrict = asyncHandler(async (req, res) => {
  let district = await req.db.district.findByPk(req.params.id);
  if (req.params.id == 1) {
    throw new ErrorMsg(
      `${req.params.id} ID-тай дүүргийг устгах боломжгүй!`,
      400
    );
  }
  if (!district) {
    throw new ErrorMsg(`${req.params.id}-ID тай дүүрэг байхгүй байна!`, 404);
  }

  let sportHalls = await req.db.sportHall.findAll({
    where: { districtId: req.params.id },
  });

  if (sportHalls) {
    for (var i = 0; i < sportHalls.length; i++) {
      await sportHalls[i].update({
        khorooId: "1",
        districtId: "1",
      });
    }
  }

  await district.destroy();

  res.status(200).json({
    success: true,
    message: "Амжилттай устгалаа",
  });
});
