const express = require("express");

const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../../controller/articles/article/articles");

const {
  createArticlesUploadFile,
  getArticlesUploadFiles,
} = require("../../controller/medialibrary/mediaLibraryArticles");

const {
  getPostedArticles,
} = require("../../controller/articles/article/postedArticles");

const {
  getSavedArticles,
} = require("../../controller/articles/article/savedArticles");

const {
  getDeletedArticles,
} = require("../../controller/articles/article/deletedArticles");

const router = express.Router();

router.route("/posted").get(getPostedArticles);

router.route("/saved").get(getSavedArticles);

router.route("/deleted").get(getDeletedArticles);

router.route("/").get(getArticles).post(createArticle);

router.route("/:id").get(getArticle).put(updateArticle).delete(deleteArticle);

router
  .route("/:id/upload")
  .post(createArticlesUploadFile)
  .get(getArticlesUploadFiles);

module.exports = router;
