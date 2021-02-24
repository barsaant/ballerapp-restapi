const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");
const jwt = require("jsonwebtoken");

exports.getFavoriteHalls = asyncHandler(async (req, res) => {
  if (!req.headers.authorization) {
    throw new ErrorMsg("Та эхлээд нэвтэрнэ үү!", 401);
  }

  const tokenCheck = req.headers.authorization.split(" ")[1];

  if (!tokenCheck) {
    throw new ErrorMsg("Алдаа гарлаа. Та дахин нэвтэрнэ үү!", 401);
  }

  const check = jwt.verify(tokenCheck, process.env.JWT_SECRET);

  const { userId } = req.body;

  if (check.id != userId) {
    throw new ErrorMsg("Алдаа гарлаа. Та дахин нэвтэрнэ үү!", 401);
  }

  if (!userId) {
    throw new ErrorMsg("Талбарыг гүйцэт бөглөнө үү", 400);
  }

  const user = await req.db.user.findByPk(userId);

  if (!user) {
    throw new ErrorMsg(`${userId} ID-тай хэрэглэгч олдсонгүй`, 404);
  }

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

  const allFavoriteHalls = await user.getSportHalls();
  let count;
  let pages;
  for (var i = 0; i < allFavoriteHalls.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }

  const { firstName, lastName, email } = user;
  const favoriteHalls = await user.getSportHalls(query);

  res.status(200).json({
    success: true,
    count,
    pages,
    user: { userId, firstName, lastName, email, favoriteHalls },
  });
});

exports.createFavoriteHall = asyncHandler(async (req, res) => {
  if (!req.headers.authorization) {
    throw new ErrorMsg("Та эхлээд нэвтэрнэ үү!", 401);
  }

  const tokenCheck = req.headers.authorization.split(" ")[1];

  if (!tokenCheck) {
    throw new ErrorMsg("Алдаа гарлаа. Та дахин нэвтэрнэ үү!", 401);
  }

  const check = jwt.verify(tokenCheck, process.env.JWT_SECRET);

  const { userId, hallId } = req.body;

  if (check.id != userId) {
    throw new ErrorMsg("Алдаа гарлаа. Та дахин нэвтэрнэ үү!", 401);
  }

  if (!userId || !hallId) {
    throw new ErrorMsg("Талбарыг гүйцэт бөглөнө үү", 400);
  }

  const userCheck = await req.db.user.findByPk(userId);

  if (!userCheck) {
    throw new ErrorMsg(`${userId} ID-тай хэрэглэгч байхгүй байна`, 404);
  }
  const sportHallCheck = await req.db.sportHall.findByPk(hallId);

  if (!sportHallCheck) {
    throw new ErrorMsg(`${hallId} ID-тай заал байхгүй байна`, 404);
  }

  const favoriteCheck = await req.db.favoriteSportHall.findOne({
    where: {
      userId: userId,
      hallId: hallId,
    },
  });

  if (favoriteCheck) {
    throw new ErrorMsg(
      "Дуртай хэсэгт бүртгэгдсэн байна. Өөр заал бүртгүүлнэ үү!",
      400
    );
  }

  const favorite = await req.db.favoriteSportHall.create({
    userId: userId,
    hallId: hallId,
  });

  res.status(200).json({
    success: true,
    favorite,
  });
});

exports.deleteFavoriteHall = asyncHandler(async (req, res) => {
  if (!req.headers.authorization) {
    throw new ErrorMsg("Та эхлээд нэвтэрнэ үү!", 401);
  }

  const tokenCheck = req.headers.authorization.split(" ")[1];

  if (!tokenCheck) {
    throw new ErrorMsg("Алдаа гарлаа. Та дахин нэвтэрнэ үү!", 401);
  }

  const check = jwt.verify(tokenCheck, process.env.JWT_SECRET);

  const { userId, hallId } = req.body;

  if (check.id != userId) {
    throw new ErrorMsg("Алдаа гарлаа. Та дахин нэвтэрнэ үү!", 401);
  }

  if (!userId || !hallId) {
    throw new ErrorMsg("Талбарыг гүйцэт бөглөнө үү", 400);
  }

  const favoriteHall = await req.db.favoriteSportHall.findOne({
    where: {
      userId: userId,
      hallId: hallId,
    },
  });

  if (!favoriteHall) {
    throw new ErrorMsg("Дуртай заал бүртгэгдээгүй байна", 404);
  }

  await favoriteHall.destroy();

  res.status(200).json({
    success: true,
    message: "Амжилттай",
  });
});
