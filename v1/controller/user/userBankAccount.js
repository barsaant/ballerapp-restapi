const asyncHandler = require("../../middleware/asyncHandler");
const ErrorMsg = require("../../utils/ErrorMsg");

exports.createUserBankAccount = asyncHandler(async (req, res) => {
  const user = await req.db.user.findByPk(req.params.id);

  if (!user) {
    throw new ErrorMsg(`Хэрэглэгч олдсонгүй!`, 404);
  }

  const { bankName, bankAccount, accountName } = req.body;

  if (!bankName || !bankAccount || !accountName) {
    throw new ErrorMsg(`Талбарыг гүйцэт бөглөнө үү!`, 404);
  }

  const userBankAccount = await req.db.userBankAccount.create({
    userId: req.params.id,
    bankName: bankName,
    bankAccount: bankAccount,
    accountName: accountName,
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    userBankAccount,
  });
});

exports.getUserBankAccount = asyncHandler(async (req, res) => {
  const user = await req.db.user.findByPk(req.params.id);

  if (!user) {
    throw new ErrorMsg(`Хэрэглэгч олдсонгүй!`, 404);
  }

  const userBankAccount = await req.db.userBankAccount.findAll({
    where: { userId: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    userBankAccount,
  });
});

exports.updateUserBankAccount = asyncHandler(async (req, res) => {
  let userBankAccount = await req.db.userBankAccount.findByPk(req.params.accid);

  if (!userBankAccount) {
    throw new ErrorMsg(`Банкны данс олдсонгүй!`, 404);
  }

  const { bankName, bankAccount, accountName } = req.body;

  if (!bankName || !bankAccount || !accountName) {
    throw new ErrorMsg(`Талбарыг гүйцэт бөглөнө үү!`, 404);
  }

  await userBankAccount.update({
    bankName: bankName,
    bankAccount: bankAccount,
    accountName: accountName,
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    userBankAccount,
  });
});

exports.updateUserBankAccount = asyncHandler(async (req, res) => {
  let userBankAccount = await req.db.userBankAccount.findByPk(req.params.accid);

  if (!userBankAccount) {
    throw new ErrorMsg(`Банкны данс олдсонгүй!`, 404);
  }

  const { bankName, bankAccount, accountName } = req.body;

  if (!bankName || !bankAccount || !accountName) {
    throw new ErrorMsg(`Талбарыг гүйцэт бөглөнө үү!`, 404);
  }

  await userBankAccount.update({
    bankName: bankName,
    bankAccount: bankAccount,
    accountName: accountName,
  });

  res.status(200).json({
    success: true,
    message: "Амжилттай",
    userBankAccount,
  });
});

exports.deleteUserBankAccount = asyncHandler(async (req, res) => {
  let userBankAccount = await req.db.userBankAccount.findByPk(req.params.accid);

  if (!userBankAccount) {
    throw new ErrorMsg(`Банкны данс олдсонгүй!`, 404);
  }

  await userBankAccount.destroy();

  res.status(200).json({
    success: true,
    message: "Амжилттай устгалаа.",
    userBankAccount,
  });
});
