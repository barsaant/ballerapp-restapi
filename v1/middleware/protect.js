const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorMsg = require("../utils/ErrorMsg");
const crypto = require("crypto");

exports.protect = asyncHandler(async (req, res, next) => {
  console.log(req.headers);
  let token = null;
  let uid = null;
  let ur = null;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
    uid = req.headers.cid;
    ur = req.headers.cr;
  } else if (req.cookies) {
    token = req.cookies["AUTHtoken"];
    uid = req.cookies["_cuid"];
    ur = req.cookies["_cr"];
  }

  const authToken = token;
  const _cuid = uid;
  const _cr = ur;

  if (!authToken && !_cuid && !_cr) {
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

  const usid = decryptUserId(_cuid);
  const usrole = decryptUserId(_cr);

  const decryptToken = (encrypted) => {
    var decipher = crypto.createDecipher(algorithm, tkpassword);
    var dec = decipher.update(encrypted, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  };

  const tokenReq = jwt.verify(authToken, process.env.JWT_SECRET);

  req.userId = decryptToken(tokenReq._tu);
  req.userRole = decryptToken(tokenReq._tr);

  const user = await req.db.user.findByPk(parseInt(req.userId));

  if (!user) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  if (user.role !== req.userRole) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  if (usid !== `${user.userId}`) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  if (usrole !== user.role) {
    throw new ErrorMsg("Та дахин нэвтэрнэ үү!", 401);
  }

  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      throw new ErrorMsg(
        "Таны эрх [" + req.userRole + "] энэ үйлдлийг гүйцэтгэхэд хүрэлцэхгүй!",
        403
      );
    }

    next();
  };
};
