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

const {
  getPostedSportHalls,
} = require("../../controller/halls/sportHall/postedSportHalls");

const {
  getSavedSportHalls,
} = require("../../controller/halls/sportHall/savedSportHalls");

const {
  getDeletedSportHalls,
} = require("../../controller/halls/sportHall/deletedSportHalls");

const router = express.Router();

router.route("/").get(getSportHalls).post(createSportHall);

router.route("/posted").get(getPostedSportHalls);

router.route("/saved").get(getSavedSportHalls);

router.route("/deleted").get(getDeletedSportHalls);

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
