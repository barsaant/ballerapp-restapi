const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");

exports.getKhoroos = asyncHandler(async (req, res) => {
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

  const allKhoroos = await req.db.khoroo.findAll();
  let count;
  let pages;
  for (var i = 0; i < allKhoroos.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }

  const khoroos = await req.db.khoroo.findAll(query);

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    count,
    pages,
    khoroos,
  });
});

exports.getkhoroo = asyncHandler(async (req, res) => {
  const khoroo = await req.db.khoroo.findByPk(req.params.id);
  if (!khoroo) {
    throw new ErrorMsg(req.params.id + " ID-тай хороо байхгүй байна.", 404);
  }
  res.status(200).json({
    success: true,
    message: "Амжилттай",
    khoroo,
  });
});

exports.createKhoroo = asyncHandler(async (req, res) => {
  const { khorooName, districtId } = req.body;
  if (!khorooName || !districtId) {
    throw new ErrorMsg("Талбарыг гүйцэт бөглөнө үү!", 401);
  }

  const districtIdCheck = await req.db.district.findOne({
    where: { districtId: districtId },
  });

  if (!districtIdCheck) {
    throw new ErrorMsg(`${districtId}-ID тай дүүрэг байхгүй байна!`, 404);
  }

  const khoroo = await req.db.khoroo.create({
    khorooName: khorooName,
    districtId: districtId,
  });
  res.status(200).json({
    success: true,
    message: "Амжилттай үүсгэлээ",
    khoroo,
  });
});

exports.updateKhoroo = asyncHandler(async (req, res) => {
  let khoroo = await req.db.khoroo.findByPk(req.params.id);
  if (!khoroo) {
    throw new ErrorMsg(`${req.params.id}-тай хороо байхгүй байна!`);
  }
  const { districtId } = req.body;
  if (districtId) {
    const districtIdCheck = await req.db.district.findOne({
      where: { districtId: districtId },
    });

    if (districtIdCheck) {
      throw new ErrorMsg(`${districtId}-ID тай дүүрэг байхгүй байна!`, 404);
    }
  }

  await khoroo.update(req.body);

  res.status(200).json({
    success: true,
    message: "Амжилттай шинэчиллээ",
    khoroo,
  });
});

exports.deleteKhoroo = asyncHandler(async (req, res) => {
  let khoroo = await req.db.khoroo.findByPk(req.params.id);

  if (req.params.id == 1) {
    throw new ErrorMsg(`${req.params.id} ID-тай хороог устгах боломжгүй!`);
  }

  let sportHalls = await req.db.sportHall.findAll({
    where: { khorooId: req.params.id },
  });

  if (sportHalls) {
    for (var i = 0; i < sportHalls.length; i++) {
      await sportHalls[i].update({
        khorooId: "1",
      });
    }
  }

  await khoroo.destroy();
  res.status(200).json({
    success: true,
    message: "Амжилттай устгалаа",
  });
});
