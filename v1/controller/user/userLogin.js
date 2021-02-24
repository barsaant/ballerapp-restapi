const asyncHandler = require("../../middleware/asyncHandler");
const ErrorMsg = require("../../utils/ErrorMsg");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/email");

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

exports.checkLogin = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new ErrorMsg("Та эхлээд нэвтэрнэ үү!", 401);
  }

  const tokenCheck = req.headers.authorization.split(" ")[1];

  if (!tokenCheck) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  const check = jwt.verify(tokenCheck, process.env.JWT_SECRET);

  const user = await req.db.user.findByPk(check.id);

  if (!user) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  if (user.role !== check.role) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  const token = jwt.sign(
    { id: user.userId, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    token,
    user,
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

  if (user.emailVerificationCodeExpire < Date.now()) {
    user.update({
      emailVerificationCode: null,
      emailVerificationCodeExpire: null,
    });
    throw new ErrorMsg("Баталгаажуулах кодны хугацаа дууссан байна!", 400);
  }

  await user.update({ emailVerified: "true" });

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
