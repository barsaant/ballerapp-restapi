const express = require("express");

const {
  getDistricts,
  getDistrict,
  createDistrict,
  updateDistrict,
  deleteDistrict,
} = require("../../controller/halls/district/districts");

const {
  getDistrictKhoroos,
} = require("../../controller/halls/district/districtKhoroos");
const {
  getDistrictSportHalls,
} = require("../../controller/halls/district/districtSportHalls");

const router = express.Router();

router.route("/").get(getDistricts).post(createDistrict);

router
  .route("/:id")
  .get(getDistrict)
  .put(updateDistrict)
  .delete(deleteDistrict);

router.route("/:id/khoroos").get(getDistrictKhoroos);
router.route("/:id/sporthalls").get(getDistrictSportHalls);
module.exports = router;
