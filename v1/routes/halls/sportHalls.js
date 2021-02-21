const express = require("express");

const {
  getSportHalls,
  getSportHall,
  createSportHall,
  updateSportHall,
  deleteSportHall,
} = require("../../controller/halls/sportHall/sportHalls");

const {
  createHallsUploadFile,
  getHallsUploadFiles,
} = require("../../controller/medialibrary/mediaLibrarySportHalls");
const router = express.Router();

router.route("/").get(getSportHalls).post(createSportHall);

router
  .route("/:id")
  .get(getSportHall)
  .put(updateSportHall)
  .delete(deleteSportHall);

router
  .route("/:id/upload")
  .post(createHallsUploadFile)
  .get(getHallsUploadFiles);

module.exports = router;
