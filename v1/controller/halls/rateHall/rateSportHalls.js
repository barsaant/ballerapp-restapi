const asyncHandler = require("../../../middleware/asyncHandler");
const ErrorMsg = require("../../../utils/ErrorMsg");
const paginate = require("../../../utils/paginate");
const jwt = require("jsonwebtoken");

exports.createRateSportHall = asyncHandler(async (req, res) => {
  if (!req.headers.authorization) {
    throw new ErrorMsg("Та эхлээд нэвтэрнэ үү!", 401);
  }

  const tokenCheck = req.headers.authorization.split(" ")[1];

  if (!tokenCheck) {
    throw new ErrorMsg("Алдаа гарлаа. Та дахин нэвтэрнэ үү!", 401);
  }

  const check = jwt.verify(tokenCheck, process.env.JWT_SECRET);

  const { userId, hallId, rate } = req.body;

  if (check.id != userId) {
    throw new ErrorMsg("Алдаа гарлаа. Та дахин нэвтэрнэ үү!", 401);
  }

  if (!userId || !hallId || !rate) {
    throw new ErrorMsg("Талбарыг гүйцэт бөглөнө үү", 400);
  }

  let rateSportHall = await req.db.rateSportHall.findOne({
    where: {
      userId: userId,
      hallId: hallId,
    },
  });

  if (!rateSportHall) {
    rateSportHall = await req.db.rateSportHall.create({
      userId: userId,
      hallId: hallId,
    });
  }

  await rateSportHall.update({
    rate: rate,
  });

  const rateSport = await req.db.rateSportHall.findAll({ where: { hallId } });

  let sum = 0;
  let loop = 0;

  for (var i = 0; i < rateSport.length; i++) {
    sum = sum + rateSport[i].rate;
    loop++;
  }

  const rateScore = sum / loop;

  let sportHall = await req.db.sportHall.findByPk(hallId);

  await sportHall.update({
    rating: rateScore,
  });

  res.status(200).json({
    success: true,
    rateSportHall,
    sportHall,
  });
});
