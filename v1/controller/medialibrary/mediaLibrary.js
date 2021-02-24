const ErrorMsg = require("../../utils/ErrorMsg");
const asyncHandler = require("../../middleware/asyncHandler");
const paginate = require("../../utils/paginate");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const fileUpload = require("express-fileupload");

exports.getUploadFiles = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  let select = req.query.select;
  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.mediaLibrary);

  let query = {
    offset: pagination.start - 1,
    limit,
  };
  if (req.query) {
    query.where = req.query;
  }

  if (select) {
    query.attributes = select;
  }

  if (sort) {
    query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "DESC" : "ASC",
      ]);
  }

  const mediaLibraries = await req.db.mediaLibrary.findAll(query);

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    mediaLibraries,
  });

  res.status(200).json({
    success: true,
    media,
  });
});

exports.getUploadFile = asyncHandler(async (req, res) => {
  const mediaLibrary = await req.db.mediaLibrary.findByPk(req.params.id);
  if (!mediaLibrary) {
    throw new ErrorMsg(`${req.params.id}-тай файл байхгүй байна`, 400);
  }

  res.status(200).json({
    success: true,
    mediaLibrary,
  });
});

exports.createUploadFile = asyncHandler(async (req, res) => {
  if (!req.files) {
    throw new ErrorMsg(`Upload хийх файлаа сонгоно уу!`);
  }

  var dir = process.env.GLOBAL_FILE_UPLOAD_DIR;
  const createDir = () => {
    fs.mkdir(dir, function (err) {
      if (err) {
        return err;
      }
      return null;
    });
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
      ,400);
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
    file.name = `global_${fileType}_${nameGenerate}${
      path.parse(file.name).ext
    }`;

    file.mv(`${process.env.GLOBAL_FILE_UPLOAD_DIR}/${file.name}`, (err) => {
      if (err) {
        console.log(err);
      }
    });

    const mediaPath = process.env.GLOBAL_FILE_UPLOADED_DIR + file.name;

    const mediaLibrary = await req.db.mediaLibrary.create({
      mediaPath: mediaPath,
      mediaType: fileType,
      mediaCategory: "global",
      base: "primary",
    });

    res.status(200).json({
      success: true,
      mediaLibrary,
    });
  };

  if (!fs.existsSync(dir)) {
    const createDirs = await createDir();
    if (createDirs) {
      throw new ErrorMsg("global хавтас үүссэнгүй", 500);
    }
    await fileUpload();
  } else await fileUpload();
});

exports.deleteUploadFile = asyncHandler(async (req, res) => {
  const mediaLibrary = await req.db.mediaLibrary.findByPk(req.params.id);

  if (!mediaLibrary) {
    throw new ErrorMsg(`${req.params.id} ID-тай файл байхгүй байна`,404);
  }

  var path = process.env.FILE_UPLOADED_DIR + mediaLibrary.mediaPath;

  fs.unlink(path, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("Файлыг амжилттай устгалаа");
  });

  await mediaLibrary.destroy();

  res.status(200).json({
    success: true,
    message: "Амжилттай устгалаа",
  });
});
