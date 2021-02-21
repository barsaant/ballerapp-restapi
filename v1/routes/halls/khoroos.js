const express = require("express");

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

router.route("/").get(getKhoroos).post(createKhoroo);

router.route("/:id").get(getkhoroo).put(updateKhoroo).delete(deleteKhoroo);

router.route("/:id/sporthalls").get(getKhorooSportHalls);

module.exports = router;
