const asyncHandler = require("../../middleware/asyncHandler");
const ErrorMsg = require("../../utils/ErrorMsg");

exports.createUserBankAccount = asyncHandler(async (req, res) => {
  const user = await req.db.user.findByPk(req.params.id);

  if (!user) {
    throw new ErrorMsg(`Хэрэглэгч олдсонгүй!`, 404);
  }

  const { bankName, bankAccount, accountName } = req.body;

  if (!bankName || !bankAccount || accountName) {
    throw new ErrorMsg(`Талбарыг гүйцэт бөглөнө үү!`, 404);
  }

  const userBankAccount = await req.db.userBankAccount.create({
    bankName: bankName,
    bankAcoount: bankAccount,
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

  const userBankAccount = await req.db.userBankAccount(async(req, res));
});
