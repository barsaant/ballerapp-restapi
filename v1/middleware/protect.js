const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandle");
const MyError = require("../utils/myError");

exports.protect = asyncHandler(async (req, res, next) => {
  // console.log(req.headers);
  let token = null;
  let uid = null;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies) {
    token = req.cookies["AUTHtoken"];
    uid = req.cookies["_cuid"];
  }

  if (!token || uid) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  const tokenObj = jwt.verify(token, process.env.JWT_SECRET);

  const user = await req.db.user.findByPk(tokenObj.Id);

  if (!user) {
    throw new MyError("Уучлаарай хэрэглэгч байхгүй байна.", 401);
  }

  if (uid !== `${user.userId}`) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      throw new MyError(
        "Таны эрх [" + req.userRole + "] энэ үйлдлийг гүйцэтгэхэд хүрэлцэхгүй!",
        403
      );
    }

    next();
  };
};
