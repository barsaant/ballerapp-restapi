const express = require("express");

const {
  confirmOrderSportHall,
} = require("../../controller/halls/sportHall/orderSportHalls");

const router = express.Router();

router.route("/:id/confirm").post(confirmOrderSportHall);

module.exports = router;
