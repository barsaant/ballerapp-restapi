const db = require("../../../../config/db-mysql");
const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");

const tagJson = {
  include: [
    {
      model: db.categoryArticle,
      attributes: ["categoryId", "categoryName", "createdAt", "updatedAt"],
      through: { attributes: [] },
    },
    {
      model: db.tagArticle,
      attributes: ["tagId", "tagName", "createdAt", "updatedAt"],
      through: { attributes: [] },
    },
    {
      model: db.user,
      as: "publisher",
      attributes: ["userId", "name", "createdAt", "updatedAt"],
      through: { attributes: [] },
    },
  ],
};

exports.getArticles = asyncHandler(async (req, res) => {
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
    include: [
      {
        model: db.categoryArticle,
        attributes: ["categoryId", "categoryName", "createdAt", "updatedAt"],
        through: { attributes: [] },
      },
      {
        model: db.tagArticle,
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

  const allArticle = await req.db.article.findAll();
  let count;
  let pages;
  for (var i = 0; i < allArticle.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }

  const articles = await req.db.article.findAll(query);

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    articles,
  });
});

exports.getArticle = asyncHandler(async (req, res) => {
  const article = await req.db.article.findByPk(req.params.id, tagJson);

  if (!article) {
    throw new ErrorMsg(`${req.params.id} ID-тай нийтлэл байхгүй байна!`);
  }

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    article,
  });
});

exports.createArticle = asyncHandler(async (req, res) => {
  const article = await req.db.article.create(req.body);

  res.status(200).json({
    success: true,
    message: "Амжилттай үүсгэлээ",
    article,
  });
});

exports.updateArticle = asyncHandler(async (req, res) => {
  let article = await req.db.article.findByPk(req.params.id);

  if (!article) {
    throw new ErrorMsg(`${req.params.id} ID-тай нийтлэл олдсонгүй.`, 400);
  }

  const { categoryId, tagId, userId } = req.body;

  await req.db.articles_category.destroy({
    where: { articleId: req.params.id },
  });

  if (categoryId) {
    for (var i = 0; i < categoryId.length; i++) {
      const categoryIdCheck = await req.db.categoryArticle.findByPk(
        categoryId[i]
      );
      if (!categoryIdCheck) {
        throw new ErrorMsg(`${tagId} ID-тай ангилал байхгүй байна!`, 404);
      }

      await req.db.articles_category.create({
        articleId: req.params.id,
        categoryId: categoryId[i],
      });
    }
  }

  await req.db.articles_tag.destroy({ where: { articleId: req.params.id } });

  if (tagId) {
    for (var i = 0; i < tagId.length; i++) {
      const tagIdCheck = await req.db.tagArticle.findByPk(tagId[i]);
      if (!tagIdCheck) {
        throw new ErrorMsg(`${tagId} ID-тай таг байхгүй байна!`, 404);
      }
      await req.db.articles_tag.create({
        articleId: req.params.id,
        tagId: tagId[i],
      });
    }
  }

  await req.db.articles_publisher.destroy({
    where: { articleId: req.params.id },
  });

  if (userId) {
    for (var i = 0; i < userId.length; i++) {
      const userIdCheck = await req.db.user.findByPk(userId[i]);

      if (!userIdCheck) {
        throw new ErrorMsg(`${tagId} ID-тай хэрэглэгч байхгүй байна!`, 404);
      }

      await req.db.articles_publisher.create({
        articleId: req.params.id,
        userId: userId[i],
      });
    }
  }

  await article.update(req.body);

  res.status(200).json({
    success: true,
    message: "Амжилттай шинэчиллээ",
    article,
  });
});

exports.moveStatusArticle = asyncHandler(async (req, res) => {
  let article = await req.db.article.findByPk(req.params.id);
  if (!article) {
    throw new ErrorMsg(`${req.params.id} ID-тай заал байхгүй байна!`, 404);
  }

  const { status } = req.body;

  article.update({ status: status });

  res.status(200).json({
    success: true,
    message: "Амжилттай устгалаа",
  });
});

exports.deleteArticle = asyncHandler(async (req, res) => {
  let article = await req.db.article.findByPk(req.params.id);

  if (!article) {
    throw new ErrorMsg(`${req.params.id} ID-тай нийтлэл олдсонгүй.`, 400);
  }

  await req.db.articles_category.destroy({
    where: { articleId: req.params.id },
  });
  await req.db.articles_tag.destroy({ where: { articleId: req.params.id } });

  await req.db.articles_publisher.destroy({
    where: { articleId: req.params.id },
  });

  await article.destroy();

  res.status(200).json({
    success: true,
    message: "Амжилттай устгалаа",
  });
});
