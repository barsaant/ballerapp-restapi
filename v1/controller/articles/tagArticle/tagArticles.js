const asyncHandler = require("../../../middleware/asyncHandler");
const tagArticle = require("../../../models/articles/tagArticle");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");

exports.getTagArticles = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  let select = req.query.select;
  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.tagArticle);

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

  const allTags = await req.db.tagArticle.findAll();
  let count;
  let pages;
  for (var i = 0; i < allTags.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }
  const tags = await req.db.tagAticle.findAll();

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    count,
    pages,
    tags,
  });
});

exports.getTagArticle = asyncHandler(async (req, res) => {
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

  const tagArticle = await req.db.tagArticle.findByPk(req.params.id);
  if (!tagArticle) {
    throw new ErrorMsg(req.params.id + " ID-тай таг байхгүй байна.", 404);
  }

  const { tagId, tagName, createdAt, updatedAt } = tagArticle;

  const allArticles = await tagArticle.getArticles();

  let count;
  let pages;
  for (var i = 0; i < allArticles.length; i++) {
    count = i + 1;
    pages = Math.ceil((i + 1) / limit);
  }

  const articles = await tagArticle.getArticles(query);

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    count,
    pages,
    tagArticles: {
      tagId,
      tagName,
      createdAt,
      updatedAt,
      articles,
    },
  });
});

exports.createTagArticle = asyncHandler(async (req, res) => {
  const { tagName } = req.body;

  if (!tagName) {
    throw new ErrorMsg("Таг-н нэрийг оруулна уу!", 400);
  }

  const tagNameCheck = await req.db.tagArticle.findOne({
    where: { tagName: tagName },
  });

  if (tagNameCheck) {
    throw new ErrorMsg(`${tagName} нэртэй таг үүссэн байна.`, 400);
  }

  const tag = await req.db.tagArticle.create(req.body);

  res.status(200).json({
    success: true,
    message: "Амжилттай үүсгэлээ",
    tag,
  });
});

exports.updateTagArticle = asyncHandler(async (req, res) => {
  let tag = req.db.tagArticle.findByPk(req.params.id);

  if (!tag) {
    throw new ErrorMsg(`${req.params.id} ID-тай таг олдсонгүй.`, 400);
  }

  const { tagName } = req.body;

  if (!tagName) {
    throw new ErrorMsg("Таг-н нэрийг оруулна уу!", 400);
  }

  const tagNameCheck = await req.db.tagArticle.findOne({
    where: { tagName: tagName },
  });

  if (tagNameCheck) {
    throw new ErrorMsg(`${tagName} нэртэй таг үүссэн байна.`, 400);
  }

  await tag.update(req.body);

  res.status(200).json({
    success: true,
    message: "Амжилттай шинэчиллээ",
    tag,
  });
});

exports.deleteTagArticle = asyncHandler(async (req, res) => {
  let tag = req.db.tagArticle.findByPk(req.params.id);

  if (!tag) {
    throw new ErrorMsg(`${req.params.id} ID-тай таг олдсонгүй.`, 400);
  }

  await req.db.articles_tag.destroy({ where: { tagId: req.params.id } });

  await tag.destroy();

  res.status(200).json({
    success: true,
    message: "Амжилттай устгалаа",
    tag,
  });
});
