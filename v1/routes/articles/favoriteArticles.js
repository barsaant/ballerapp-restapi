const express = require("express");

const {
  getFavoriteArticles,
  createFavoriteArticles,
  deleteFavoriteArticle,
} = require("../../controller/articles/favoriteArticle/favoriteArticles");

const router = express.Router();

router
  .route("/")
  .get(getFavoriteArticles)
  .post(createFavoriteArticles)
  .delete(deleteFavoriteArticle);

module.exports = router;
