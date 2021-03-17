const asyncHandler = require("../../middleware/asyncHandler");
const ErrorMsg = require("../../utils/ErrorMsg");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/email");
const crypto = require("crypto");
const { pathToFileURL } = require("url");

exports.staffLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorMsg("Талбарыг гүйцэт бөглөнө үү!", 401);
  }

  const user = await req.db.user.findOne({ where: { email: email } });

  if (!user) {
    throw new ErrorMsg("Таны email эсвэл нууц үг буруу байна!", 401);
  }

  const checkPassword = await req.db.user.checkPassword(email, password);

  if (!checkPassword) {
    throw new ErrorMsg("Таны email эсвэл нууц үг буруу байна!", 401);
  }

  if (
    user.role !== "operator" &&
    user.role !== "publisher" &&
    user.role !== "admin" &&
    user.role !== "superadmin"
  ) {
    throw new ErrorMsg("Танд нэвтрэх эрх байхгүй байна", 401);
  }

  const algorithm = "aes-256-ctr";
  const enpassword = "Rp9Y}V>Qh.>(2u9X";

  const tkpassword = "?,-FzZUgZ5<[`~+U";

  const encryptUserId = (userId) => {
    var cipher = crypto.createCipher(algorithm, enpassword);
    var crypted = cipher.update(userId, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
  };

  const encryptToken = (userId) => {
    var cipher = crypto.createCipher(algorithm, tkpassword);
    var crypted = cipher.update(userId, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
  };

  const _tu = encryptToken(`${user.userId}`);
  const _tr = encryptToken(`${user.role}`);

  const _cuid = encryptUserId(`${user.userId}`);
  const _cr = encryptUserId(`${user.role}`);

  // _tu = hereglegch _ts = erh

  const token = jwt.sign({ _tu: _tu, _tr: _tr }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

  const cookieOptionToken = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    domain: `${process.env.COOKIE_DOMAIN}`,
    sameSite: "lax",
    secure: true,
  };

  const cookieOption = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  };

  res
    .status(200)
    .cookie("_cuid", _cuid, cookieOptionToken)
    .cookie("_cr", _cr, cookieOption)
    .cookie("AUTHtoken", token, cookieOption)
    .json({
      success: true,
      message: "Амжилттай нэвтэрлээ",
    });
});

exports.staffLogout = asyncHandler(async (req, res, next) => {
  const cookieOption = {
    expires: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res
    .status(200)
    .cookie("_cuid", null, cookieOption)
    .cookie("_cr", null, cookieOption)
    .cookie("AUTHtoken", null, cookieOption)
    .json({
      success: true,
      message: "Амжилттай",
    });
});

exports.checkLogin = asyncHandler(async (req, res, next) => {
  if (!req.cookies) {
    throw new ErrorMsg("Та нэвтэрнэ үү!", 401);
  }

  const authToken = req.cookies["AUTHtoken"];
  const _cuid = req.cookies["_cuid"];
  const _cr = req.cookies["_cr"];

  if (!authToken || !_cuid) {
    throw new ErrorMsg("Та нэвтэрнэ үү!", 401);
  }

  const algorithm = "aes-256-ctr";
  const enpassword = "Rp9Y}V>Qh.>(2u9X";
  const tkpassword = "?,-FzZUgZ5<[`~+U";

  const decryptUserId = (encrypted) => {
    var decipher = crypto.createDecipher(algorithm, enpassword);
    var dec = decipher.update(encrypted, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  };

  const uid = decryptUserId(_cuid);
  const urole = decryptUserId(_cr);

  const decryptToken = (encrypted) => {
    var decipher = crypto.createDecipher(algorithm, tkpassword);
    var dec = decipher.update(encrypted, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  };

  const tokenReq = jwt.verify(authToken, process.env.JWT_SECRET);

  const userId = decryptToken(tokenReq._tu);
  const userRole = decryptToken(tokenReq._tr);

  const user = await req.db.user.findByPk(parseInt(userId));

  if (!user) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  if (user.role !== userRole) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  if (uid !== `${user.userId}`) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  if (urole !== user.role) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  res.status(200).json({
    success: true,
    message: "Амжилттай",
  });
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorMsg("Талбарыг гүйцэт бөглөнө үү!", 401);
  }

  const user = await req.db.user.findOne({ where: { email: email } });

  if (!user) {
    throw new ErrorMsg("Таны email эсвэл нууц үг буруу байна!", 401);
  }

  const checkPassword = await req.db.user.checkPassword(email, password);

  if (!checkPassword) {
    throw new ErrorMsg("Таны email эсвэл нууц үг буруу байна!", 401);
  }
  const userId = user.userId;
  const emailVerified = user.emailVerified;
  if (user.emailVerified == "false") {
    res.status(200).json({
      success: false,
      message: "Email-ээ баталгаажуулна уу!",
      userId,
      emailVerified,
    });
  } else {
    const token = jwt.sign(
      { id: user.userId, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRESIN,
      }
    );
    res.status(200).json({
      success: true,
      message: "Амжилттай нэвтэрлээ!",
      token,
      user,
    });
  }
});

exports.emailVerify = asyncHandler(async (req, res) => {
  const user = await req.db.user.findByPk(req.params.id);

  const { verificationCode } = req.body;

  if (!verificationCode) {
    throw new ErrorMsg("Баталгаауулах код оруулна уу", 400);
  }

  if (verificationCode !== user.emailVerificationCode) {
    throw new ErrorMsg("Баталгаажуулах код буруу байна!", 400);
  }

  if (Date.parse(user.emailVerificationCodeExpire) < Date.now()) {
    user.update({
      emailVerificationCode: null,
      emailVerificationCodeExpire: null,
    });
    throw new ErrorMsg("Баталгаажуулах кодны хугацаа дууссан байна!", 400);
  }

  await user.update({
    emailVerified: "true",
    emailVerificationCode: null,
    emailVerificationCodeExpire: null,
  });

  const token = jwt.sign(
    { id: user.userId, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );
  res.status(200).json({
    success: true,
    message: "Амжилттай нэвтэрлээ",
    token,
    user,
  });
});

// Шинээр баталгаажуулах код авах /JSON дотроос User Устгах/

exports.reSendEmailVerification = asyncHandler(async (req, res) => {
  const user = await req.db.user.findByPk(req.params.id);

  if (!user) {
    throw new ErrorMsg("Алдаа гарлаа!", 400);
  }

  if (user.emailVerificationCode == "true") {
    throw new ErrorMsg(
      "Уучлаарай баталгаажсан email байна. Нэвтэрч ороод өөрчилнө үү!",
      400
    );
  }

  const randomDigit = Math.floor(100000 + Math.random() * 900000);

  const expireDate = Date.now() + 10 * 60 * 1000;

  const message = `
  Сайн байна уу? <br><br>
  Таны Email баталгаажуулах код: ${randomDigit} <br><br>
  Баталгаажуулах код 10 минут хүчинтэй.
  `;
  const email = user.email;

  await sendEmail({
    email: email,
    subject: "[BALLER.MN] EMAIL БАТАЛГААЖУУЛАХ КОД",
    message,
  });

  await user.update({
    emailVerificationCode: randomDigit,
    emailVerificationCodeExpire: expireDate,
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    user,
  });
});

// Мэйл хаягаа өөрчлөх.

exports.updateLoginEmail = asyncHandler(async (req, res) => {
  let user = await req.db.user.findByPk(req.params.id);
  if (!user) {
    throw new ErrorMsg("Алдаа гарлаа!", 400);
  }

  if (user.emailVerificationCode == "true") {
    throw new ErrorMsg(
      "Уучлаарай баталгаажсан email байна. Нэвтэрч ороод өөрчилнө үү!",
      400
    );
  }

  const { email } = req.body;
  if (!email) {
    throw new ErrorMsg("Та email хаягаа оруулна уу!", 400);
  }

  const emailCheck = await req.db.user.findOne({ where: { email: email } });

  if (emailCheck) {
    throw new ErrorMsg(
      `${email} бүртгэгдсэн байна. Өөр email хаяг оруулна уу!`,
      400
    );
  }

  const randomDigit = Math.floor(100000 + Math.random() * 900000);

  const expireDate = Date.now() + 10 * 60 * 1000;

  const message = `
    Сайн байна уу? <br><br>
    Таны Email баталгаажуулах код: ${randomDigit} <br><br>
    Баталгаажуулах код 10 минут хүчинтэй.
    `;

  await sendEmail({
    email: email,
    subject: "[BALLER.MN] EMAIL БАТАЛГААЖУУЛАХ КОД",
    message,
  });

  await user.update({
    email: email,
    emailVerificationCode: randomDigit,
    emailVerificationCodeExpire: expireDate,
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    user,
  });
});
