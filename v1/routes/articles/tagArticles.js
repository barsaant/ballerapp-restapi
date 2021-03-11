const express = require("express");
const { protect, authorize } = require("../../middleware/protect");

const {
  getTagArticles,
  getTagArticle,
  createTagArticle,
  updateTagArticle,
  deleteTagArticle,
} = require("../../controller/articles/tagArticle/tagArticles");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin", "superadmin"), getTagArticles)
  .post(protect, authorize("admin", "superadmin"), createTagArticle);

router
  .route("/:id")
  .get(getTagArticle)
  .put(protect, authorize("admin", "superadmin"), updateTagArticle)
  .delete(protect, authorize("admin", "superadmin"), deleteTagArticle);

module.exports = router;
