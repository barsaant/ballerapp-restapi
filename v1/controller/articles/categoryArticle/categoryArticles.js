const db = require("../../../../config/db-mysql");
const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");

exports.getCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  let select = req.query.select;
  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.categoryArticle);

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

  const allCategories = await req.db.categoryArticle.findAll();
  let count;
  let pages;
  for (var i = 0; i < allCategories.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }

  const categories = await req.db.categoryArticle.findAll(query);

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    count,
    pages,
    categories,
  });
});

exports.getCategory = asyncHandler(async (req, res) => {
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
    where: { status: "posted" },
    include: [
      {
        model: db.categoryArticle,
        attributes: ["categoryId", "categoryName", "createdAt", "updatedAt"],
        through: { attributes: [] },
      },
    ],
  };
  // if (req.query) {
  //   query.where = req.query;
  // }

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

  const categoryArticle = await req.db.categoryArticle.findByPk(req.params.id);
  if (!categoryArticle) {
    throw new ErrorMsg(req.params.id + " ID-тай ангилал байхгүй байна.", 404);
  }

  const { categoryId, categoryName, createdAt, updatedAt } = categoryArticle;

  const allArticles = await categoryArticle.getArticles();

  let count;
  let pages;
  for (var i = 0; i < allArticles.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }

  const articles = await categoryArticle.getArticles(query);

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    count,
    pages,
    categoryArticle: {
      categoryId,
      categoryName,
      createdAt,
      updatedAt,
      articles,
    },
  });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    throw new ErrorMsg("Ангилалын нэрийг оруулна уу!", 400);
  }

  const categoryNameCheck = await req.db.categoryArticle.findOne({
    where: { categoryName: categoryName },
  });

  if (categoryNameCheck) {
    throw new ErrorMsg(`${categoryName} нэртэй ангилал үүссэн байна.`, 400);
  }

  const category = await req.db.categoryArticle.create(req.body);

  res.status(200).json({
    success: true,
    message: "Амжилттай үүсгэлээ",
    category,
  });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  let category = req.db.categoryArticle.findByPk(req.params.id);

  if (!category) {
    throw new ErrorMsg(`${req.params.id} ID-тай категори олдсонгүй.`, 400);
  }

  const { categoryName } = req.body;

  if (!categoryName) {
    throw new ErrorMsg("Ангилалын нэрийг оруулна уу!", 400);
  }

  const categoryNameCheck = await req.db.categoryArticle.findOne({
    where: { categoryName: categoryName },
  });

  if (categoryNameCheck) {
    throw new ErrorMsg(`${categoryName} нэртэй ангилал үүссэн байна.`, 400);
  }

  await category.update(req.body);

  res.status(200).json({
    success: true,
    message: "Амжилттай шинэчиллээ",
    category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  let category = req.db.categoryArticle.findByPk(req.params.id);

  if (!category) {
    throw new ErrorMsg(`${req.params.id} ID-тай категори олдсонгүй.`, 400);
  }

  await req.db.articles_category.destroy({
    where: { categoryId: req.params.id },
  });

  await category.destroy();

  res.status(200).json({
    success: true,
    message: "Амжилттай устгалаа",
    category,
  });
});
