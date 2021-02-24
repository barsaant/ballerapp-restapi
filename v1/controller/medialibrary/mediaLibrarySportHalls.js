const asyncHandler = require("../../middleware/asyncHandler");
const ErrorMsg = require("../../utils/ErrorMsg");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const { create } = require("domain");

exports.getHallsUploadFiles = asyncHandler(async (req, res) => {
  const halls = await req.db.mediaLibrary_sportHalls.findAll({
    where: {
      hallId: req.params.id,
    },
  });
  let hallsMedia = [];
  for (var i = 0; i < halls.length; i++) {
    const media = await req.db.mediaLibrary.findByPk(halls[i].mediaId);
    hallsMedia.push(media);
  }

  res.status(200).json({
    success: true,
    hallsMedia,
  });
});

exports.createHallsUploadFile = asyncHandler(async (req, res) => {
  const sportHalls = await req.db.sportHall.findByPk(req.params.id);

  if (!req.files) {
    throw new ErrorMsg(`Upload хийх файлаа сонгоно уу!`);
  }

  if (!sportHalls) {
    throw new ErrorMsg(`${req.params.id} ID-тай заал байхгүй байна.`);
  }
  var dir = process.env.HALL_FILE_UPLOAD_DIR;

  const createDir = () => {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, function (err) {
        if (err) {
          return err;
        }
        return null;
      });
    }
  };

  const createParamsDir = () => {
    if (!fs.existsSync(dir + req.params.id)) {
      fs.mkdir(dir + req.params.id, function (err) {
        if (err) {
          return err;
        }
        return null;
      });
    }
  };

  const fileUpload = async () => {
    const file = req.files.file;
    let fileType;
    if (
      !file.mimetype.startsWith("image") &&
      !file.mimetype.startsWith("video") &&
      !file.mimetype.startsWith("application/pdf")
    ) {
      throw new ErrorMsg(
        `${req.files.file.mimetype} төрлийн файл upload хийх боломжгүй.`
      );
    }

    if (file.mimetype.startsWith("image")) {
      fileType = "image";
    } else if (file.mimetype.startsWith("video")) {
      fileType = "video";
    } else if (file.mimetype.startsWith("application/pdf")) {
      fileType = "pdf";
    }

    if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
      throw new ErrorMsg(
        `Дээд талдаа 2GB хэмжээтэй зүйл upload хийх боломжтой`,
        400
      );
    }
    const nameGenerate = crypto.randomBytes(3).toString("hex");
    file.name = `${req.params.id}_${fileType}_${nameGenerate}${
      path.parse(file.name).ext
    }`;

    file.mv(
      `${process.env.HALL_FILE_UPLOAD_DIR}/${req.params.id}/${file.name}`,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    const mediaPath =
      process.env.HALL_FILE_UPLOADED_DIR + req.params.id + "/" + file.name;

    const mediaLibrary = await req.db.mediaLibrary.create({
      mediaPath: mediaPath,
      mediaType: fileType,
      mediaCategory: "sporthalls",
      base: "primary",
    });

    await req.db.mediaLibrary_sportHalls.create({
      hallId: req.params.id,
      mediaId: mediaLibrary.mediaId,
    });

    res.status(200).json({
      success: true,
      mediaLibrary,
    });
  };

  const subFolderCheck = async () => {
    if (!fs.existsSync(dir + req.params.id)) {
      const createParams = await createParamsDir();
      if (createParams) {
        throw new ErrorMsg("sporthalls/:id хавтас үүссэнгүй", 500);
      }
      await fileUpload();
    } else await fileUpload();
  };

  if (!fs.existsSync(dir)) {
    const createDirs = await createDir();
    if (createDirs) {
      throw new ErrorMsg("sporthalls хавтас үүссэнгүй", 500);
    }
    await subFolderCheck();
  } else await subFolderCheck();
});
