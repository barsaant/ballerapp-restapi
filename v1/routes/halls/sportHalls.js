const express = require("express");
const { protect, authorize } = require("../../middleware/protect");

const {
  getSportHalls,
  getSportHall,
  createSportHall,
  updateSportHall,
  deleteSportHall,
  moveStatusSportHall,
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

const {
  getSportHallStaff,
  updateSportHallStaff,
  getScheduleSportHall,
  createScheduleSportHall,
} = require("../../controller/halls/sportHall/sportHallsStaff");

const {
  createOrderSportHall,
} = require("../../controller/halls/sportHall/orderSportHalls");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin", "superadmin"), getSportHalls)
  .post(protect, authorize("admin", "superadmin"), createSportHall);

router.route("/posted").get(getPostedSportHalls);

router
  .route("/saved")
  .get(protect, authorize("admin", "superadmin"), getSavedSportHalls);

router
  .route("/deleted")
  .get(protect, authorize("admin", "superadmin"), getDeletedSportHalls);

router
  .route("/:id")
  .get(getSportHall)
  .put(protect, authorize("admin", "superadmin"), updateSportHall)
  .delete(protect, authorize("admin", "superadmin"), deleteSportHall);

router
  .route("/:id/delete")
  .put(protect, authorize("admin", "superadmin"), moveStatusSportHall);

router
  .route("/:id/upload")
  .post(protect, authorize("admin", "superadmin"), createHallsUploadFile)
  .get(protect, authorize("admin", "superadmin"), getHallsUploadFiles);

router
  .route("/:id/schedule")
  .get(getScheduleSportHall)
  .post(createScheduleSportHall);

router.route("/:id/order").post(createOrderSportHall);

module.exports = router;
