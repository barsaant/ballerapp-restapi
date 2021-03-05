const express = require("express");
const { protect, authorize } = require("../../middleware/protect");

const {
  getTagSportHalls,
  getTagSportHall,
  createTagSportHall,
  updateTagSportHall,
  deleteTagSportHall,
} = require("../../controller/halls/tagSportHall/tagSportHalls");

const router = express.Router();

router
  .route("/")
  .get(getTagSportHalls)
  .post(protect, authorize("admin", "superadmin"), createTagSportHall);

router
  .route("/:id")
  .get(getTagSportHall)
  .put(protect, authorize("admin", "superadmin"), updateTagSportHall)
  .delete(protect, authorize("admin", "superadmin"), deleteTagSportHall);

module.exports = router;
