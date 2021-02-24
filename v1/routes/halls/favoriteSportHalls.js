const express = require("express");

const {
  getFavoriteHalls,
  createFavoriteHall,
  deleteFavoriteHall,
} = require("../../controller/halls/favoriteHall/favoriteHalls");

const router = express.Router();

router
  .route("/")
  .get(getFavoriteHalls)
  .post(createFavoriteHall)
  .delete(deleteFavoriteHall);

module.exports = router;
