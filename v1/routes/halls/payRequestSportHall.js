const express = require("express");

const {
  getOrderSportHall,
  confirmOrderSportHall,
} = require("../../controller/halls/sportHall/orderSportHalls");

const router = express.Router();

router.route("/:id").get(getOrderSportHall);

router.route("/:id/confirm").post(confirmOrderSportHall);

module.exports = router;
