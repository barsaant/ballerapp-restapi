const express = require("express");
const { protect, authorize } = require("../../middleware/protect");

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

router
  .route("/")
  .get(getDistricts)
  .post(protect, authorize("admin", "superadmin"), createDistrict);

router
  .route("/:id")
  .get(getDistrict)
  .put(protect, authorize("admin", "superadmin"), updateDistrict)
  .delete(protect, authorize("admin", "superadmin"), deleteDistrict);

router.route("/:id/khoroos").get(getDistrictKhoroos);
router.route("/:id/sporthalls").get(getDistrictSportHalls);
module.exports = router;
