const asyncHandler = require("../../middleware/asyncHandler");
const ErrorMsg = require("../../utils/ErrorMsg");
const bcrypt = require("bcrypt");

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await req.db.user.findAll();

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    users,
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await req.db.user.findByPk(req.params.id);

  if (!user) {
    throw new ErrorMsg(`${req.params.id} ID-тай хэрэглэгч байхгүй байна`, 400);
  }

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    user,
  });
});

exports.createUserStaff = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorMsg(`Талбарыг гүйцэт бөглөнө үү!`, 400);
  }

  const uniqueMail = await req.db.user.findOne({ where: { email: email } });

  if (uniqueMail) {
    throw new ErrorMsg(`${email} бүртгэгдсэн байна.`, 400);
  }

  const salt = await bcrypt.genSalt(10);
  const encryptPassword = await bcrypt.hash(password, salt);

  const user = await req.db.user.create(req.body);

  user.update({ password: encryptPassword });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    user,
  });
});

exports.updateUserStaff = asyncHandler(async (req, res) => {
  let user = await req.db.user.findByPk(req.params.id);

  if (!user) {
    throw new ErrorMsg(`${req.params.id} ID-тай хэрэглэгч байхгүй байна.`);
  }

  const { email, password } = req.body;

  if (email) {
    const emailCheck = await req.db.user.findOne({ where: { email: email } });
    if (emailCheck) {
      throw new ErrorMsg(
        `${email} бүртгэгдсэн байна. Email солих хэсгийг цуцална уу`,
        400
      );
    }
  }

  await user.update(req.body);
  const encryptPassword = password;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    encryptPassword = await bcrypt.hash(password, salt);
    await user.update({ password: encryptPassword });
  }

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    user,
  });
});

exports.deleteUserStaff = asyncHandler(async (req, res) => {
  let user = await req.db.user.findByPk(req.params.id);

  if (!user) {
    throw new ErrorMsg(`${req.params.id} ID-тай хэрэглэгч байхгүй байна.`);
  }

  await req.db.favoriteSportHall.destroy({ where: { userId: req.params.id } });
  await req.db.rateSportHall.destroy({ where: { userId: req.params.id } });

  await user.destroy();
  res.status(200).json({
    success: true,
    message: "Амжилттай устгалаа",
  });
});
