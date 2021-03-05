const express = require("express");

const {
  getTagArticles,
  getTagArticle,
  createTagArticle,
  updateTagArticle,
  deleteTagArticle,
} = require("../../controller/articles/tagArticle/tagArticles");

const router = express.Router();

router.route("/").get(getTagArticles).post(createTagArticle);

router
  .route("/:id")
  .get(getTagArticle)
  .put(updateTagArticle)
  .delete(deleteTagArticle);

module.exports = router;
