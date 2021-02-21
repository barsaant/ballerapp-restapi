const express = require("express");

const {
  getUploadFile,
  getUploadFiles,
  createUploadFile,
  deleteUploadFile,
} = require("../../controller/medialibrary/mediaLibrary");

const router = express.Router();

router.route("/").get(getUploadFiles).post(createUploadFile);

router.route("/:id").get(getUploadFile).delete(deleteUploadFile);

module.exports = router;
