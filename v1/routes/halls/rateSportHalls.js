const express = require("express");

const {
  createRateSportHall,
} = require("../../controller/halls/rateHall/rateSportHalls");

const router = express.Router();

router.route("/").post(createRateSportHall);

module.exports = router;
