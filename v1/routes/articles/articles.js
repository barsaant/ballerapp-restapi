const express = require("express");
const { protect, authorize } = require("../../middleware/protect");

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

router
  .route("/saved")
  .get(protect, authorize("admin", "superadmin"), getSavedArticles);

router
  .route("/deleted")
  .get(protect, authorize("admin", "superadmin"), getDeletedArticles);

router
  .route("/")
  .get(getArticles)
  .post(protect, authorize("admin", "superadmin"), createArticle);

router
  .route("/:id")
  .get(protect, authorize("admin", "superadmin"), getArticle)
  .put(protect, authorize("admin", "superadmin"), updateArticle)
  .delete(protect, authorize("admin", "superadmin"), deleteArticle);

router
  .route("/:id/upload")
  .post(protect, authorize("admin", "superadmin"), createArticlesUploadFile)
  .get(protect, authorize("admin", "superadmin"), getArticlesUploadFiles);

module.exports = router;
