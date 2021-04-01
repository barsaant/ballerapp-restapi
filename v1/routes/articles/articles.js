const express = require("express");
const { protect, authorize } = require("../../middleware/protect");

const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  moveStatusArticle,
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
  .get(protect, authorize("admin", "superadmin"), getArticles)
  .post(protect, authorize("admin", "superadmin"), createArticle);

router
  .route("/:id")
  .get(protect, getArticle)
  .put(protect, authorize("admin", "superadmin"), updateArticle)
  .delete(protect, authorize("admin", "superadmin"), deleteArticle);

router
  .route("/:id/delete")
  .put(protect, authorize("admin", "superadmin"), moveStatusArticle);

router
  .route("/:id/upload")
  .post(protect, authorize("admin", "superadmin"), createArticlesUploadFile)
  .get(protect, authorize("admin", "superadmin"), getArticlesUploadFiles);

module.exports = router;
