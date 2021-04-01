const express = require("express");
const { protect, authorize } = require("../../middleware/protect");

const {
  getFavoriteArticles,
  createFavoriteArticles,
  deleteFavoriteArticle,
} = require("../../controller/articles/favoriteArticle/favoriteArticles");

const router = express.Router();

router
  .route("/")
  .get(protect, getFavoriteArticles)
  .post(protect, createFavoriteArticles)
  .delete(protect, deleteFavoriteArticle);

module.exports = router;
