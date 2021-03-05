const asyncHandler = require("../../middleware/asyncHandler");
const ErrorMsg = require("../../utils/ErrorMsg");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const { create } = require("domain");

exports.getArticlesUploadFiles = asyncHandler(async (req, res) => {
  const articles = await req.db.mediaLibrary_articles.findAll({
    where: {
      articleId: req.params.id,
    },
  });
  let articlesMedia = [];
  for (var i = 0; i < articles.length; i++) {
    const media = await req.db.mediaLibrary.findByPk(articles[i].mediaId);
    articlesMedia.push(media);
  }

  res.status(200).json({
    success: true,
    articlesMedia,
  });
});

exports.createArticlesUploadFile = asyncHandler(async (req, res) => {
  const articles = await req.db.article.findByPk(req.params.id);

  if (!req.files) {
    throw new ErrorMsg(`Upload хийх файлаа сонгоно уу!`);
  }

  if (!articles) {
    throw new ErrorMsg(`${req.params.id} ID-тай нийтлэл байхгүй байна.`);
  }
  var dir = process.env.ARTICLE_FILE_UPLOAD_DIR;

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
      `${process.env.ARTICLE_FILE_UPLOAD_DIR}/${req.params.id}/${file.name}`,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    const mediaPath =
      process.env.ARTICLE_FILE_UPLOAD_DIR + req.params.id + "/" + file.name;

    const mediaLibrary = await req.db.mediaLibrary.create({
      mediaPath: mediaPath,
      mediaType: fileType,
      mediaCategory: "articles",
      base: "primary",
    });

    await req.db.mediaLibrary_articles.create({
      articleId: req.params.id,
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
        throw new ErrorMsg("articles/:id хавтас үүссэнгүй", 500);
      }
      await fileUpload();
    } else await fileUpload();
  };

  if (!fs.existsSync(dir)) {
    const createDirs = await createDir();
    if (createDirs) {
      throw new ErrorMsg("articles хавтас үүссэнгүй", 500);
    }
    await subFolderCheck();
  } else await subFolderCheck();
});
