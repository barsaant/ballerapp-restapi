const express = require("express");
const { protect, authorize } = require("../../middleware/protect");

const {
  getKhoroos,
  getkhoroo,
  createKhoroo,
  updateKhoroo,
  deleteKhoroo,
} = require("../../controller/halls/khoroo/khoroos");

const {
  getKhorooSportHalls,
} = require("../../controller/halls/khoroo/khorooSportHalls");

const router = express.Router();

router
  .route("/")
  .get(getKhoroos)
  .post(protect, authorize("admin", "superadmin"), createKhoroo);

router
  .route("/:id")
  .get(getkhoroo)
  .put(protect, authorize("admin", "superadmin"), updateKhoroo)
  .delete(protect, authorize("admin", "superadmin"), deleteKhoroo);

router.route("/:id/sporthalls").get(getKhorooSportHalls);

module.exports = router;
