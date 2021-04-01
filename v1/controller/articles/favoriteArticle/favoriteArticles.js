const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");
const jwt = require("jsonwebtoken");

exports.getFavoriteArticles = asyncHandler(async (req, res) => {
  const user = await req.db.user.findByPk(req.userId);

  console.log(user);

  if (!user) {
    throw new ErrorMsg(`${req.userId} ID-тай хэрэглэгч олдсонгүй`, 404);
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  let select = req.query.select;
  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.article);

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

  const allFavoriteArticles = await user.getFavorite();
  let count;
  let pages;
  for (var i = 0; i < allFavoriteArticles.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }

  const { userId } = user;

  const favoriteArticles = await user.getFavorite(query);

  res.status(200).json({
    success: true,
    count,
    pages,
    user: { userId, favoriteArticles },
  });
});

exports.createFavoriteArticles = asyncHandler(async (req, res) => {
  const user = await req.db.user.findByPk(req.userId);

  if (!user) {
    throw new ErrorMsg(`Хэрэглэгч олдсонгүй`, 404);
  }

  const { articleId } = req.body;

  const articleCheck = await req.db.article.findByPk(articleId);

  if (!articleCheck) {
    throw new ErrorMsg(`${articleId} ID-тай нийтлэл байхгүй байна`, 404);
  }

  const favoriteCheck = await req.db.favoriteArticle.findOne({
    where: {
      userId: user.userId,
      articleId: articleId,
    },
  });

  if (favoriteCheck) {
    throw new ErrorMsg("Дуртай хэсэгт бүртгэгдсэн байна.", 400);
  }

  const favorite = await req.db.favoriteArticle.create({
    userId: user.userId,
    articleId: articleId,
  });

  res.status(200).json({
    success: true,
    favorite,
  });
});

exports.deleteFavoriteArticle = asyncHandler(async (req, res) => {
  const user = await req.db.user.findByPk(req.userId);

  if (!user) {
    throw new ErrorMsg(`Хэрэглэгч олдсонгүй`, 404);
  }

  const { articleId } = req.body;

  const articleCheck = await req.db.aritcicle(articleId);
  if (!articleCheck) {
    throw new ErrorMsg(`${articleId} ID-тай нийтлэл байхгүй байна`, 404);
  }

  const favoriteArticle = await req.db.favoriteArticles.findOne({
    where: {
      userId: user.userId,
      articleId: articleId,
    },
  });

  if (!favoriteArticle) {
    throw new ErrorMsg("Дуртай нийтлэл бүртгэгдээгүй байна", 404);
  }

  await favoriteArticle.destroy();

  res.status(200).json({
    success: true,
    message: "Амжилттай",
  });
});
