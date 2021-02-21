const express = require("express");

const {
  getTagSportHalls,
  getTagSportHall,
  createTagSportHall,
  updateTagSportHall,
  deleteTagSportHall,
} = require("../../controller/halls/tagSportHall/tagSportHalls");

const router = express.Router();

router.route("/").get(getTagSportHalls).post(createTagSportHall);

router
  .route("/:id")
  .get(getTagSportHall)
  .put(updateTagSportHall)
  .delete(deleteTagSportHall);

module.exports = router;
