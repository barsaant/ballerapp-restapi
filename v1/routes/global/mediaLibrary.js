const express = require("express");
const { protect, authorize } = require("../../middleware/protect");

const {
  getUploadFile,
  getUploadFiles,
  createUploadFile,
  deleteUploadFile,
} = require("../../controller/medialibrary/mediaLibrary");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin", "superadmin"), getUploadFiles)
  .post(protect, authorize("admin", "superadmin"), createUploadFile);

router
  .route("/:id")
  .get(protect, authorize("admin", "superadmin"), getUploadFile)
  .delete(protect, authorize("admin", "superadmin"), deleteUploadFile);

module.exports = router;
