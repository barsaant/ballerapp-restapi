const asyncHandler = require("../../middleware/asyncHandler");
const ErrorMsg = require("../../utils/ErrorMsg");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

exports.facebookLogin = asyncHandler(async (req, res) => {
  const { facebookToken } = req.body;

  if (!facebookToken) {
    throw new ErrorMsg(
      "Алдаа гарлаа. Та түр хүлээгээд дахин оролдоно уу!",
      401
    );
  }

  axios
    .get(
      `https://graph.facebook.com//me?fields=id,name,email&access_token=${facebookToken}`
    )
    .then(async (result) => {
      const encryptUserId = (userId) => {
        var cipher = crypto.createCipher(
          process.env.EN_ALGORITHM,
          process.env.EN_PASSWORD
        );
        var crypted = cipher.update(userId, "utf8", "hex");
        crypted += cipher.final("hex");
        return crypted;
      };

      const tkpassword = "?,-FzZUgZ5<[`~+U";

      const encryptToken = (userId) => {
        var cipher = crypto.createCipher(process.env.EN_ALGORITHM, tkpassword);
        var crypted = cipher.update(userId, "utf8", "hex");
        crypted += cipher.final("hex");
        return crypted;
      };

      let user = await req.db.user.findOne({
        where: { email: result.data.email },
      });
      if (!user) {
        const password = await crypto.randomBytes(25).toString("hex");
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);
        user = await req.db.user.create({
          name: result.data.name,
          email: result.data.email,
          password: bcryptPassword,
        });
        const { userId } = user;
        await req.db.userVerify.create({
          userId: userId,
        });
      }

      const userVerify = await req.db.userVerify.findOne({
        where: { userId: user.userId },
      });

      await userVerify.update({
        emailVerified: true,
      });

      const _cu = encryptUserId(`${user.userId}`);
      const _cr = encryptUserId(`${user.role}`);

      const _tu = encryptToken(`${user.userId}`);
      const _tr = encryptToken(`${user.role}`);

      const token = jwt.sign({ _tu: _tu, _tr: _tr }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN,
      });

      const { emailVerified } = userVerify;

      res.status(200).json({
        success: true,
        message: "Амжилттай нэвтэрлээ!",
        AUTHtoken: token,
        emailVerified,
        _cu,
        _cr,
      });
    })
    .catch(async (err) => {
      res.status(401).json({
        success: false,
        error: {
          message: "Алдаа гарлаа. Та түр хүлээгээд дахин оролдоно уу!",
        },
      });
    });
});

exports.googleLogin = asyncHandler(async (req, res) => {
  const { googleToken } = req.body;

  if (!googleToken) {
    throw new ErrorMsg(
      "Алдаа гарлаа. Та түр хүлээгээд дахин оролдоно уу!",
      401
    );
  }

  axios
    .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`)
    .then(async (result) => {
      const encryptUserId = (userId) => {
        var cipher = crypto.createCipher(
          process.env.EN_ALGORITHM,
          process.env.EN_PASSWORD
        );
        var crypted = cipher.update(userId, "utf8", "hex");
        crypted += cipher.final("hex");
        return crypted;
      };

      const tkpassword = "?,-FzZUgZ5<[`~+U";

      const encryptToken = (userId) => {
        var cipher = crypto.createCipher(process.env.EN_ALGORITHM, tkpassword);
        var crypted = cipher.update(userId, "utf8", "hex");
        crypted += cipher.final("hex");
        return crypted;
      };

      let user = await req.db.user.findOne({
        where: { email: result.data.email },
      });

      if (!user) {
        const password = await crypto.randomBytes(25).toString("hex");
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);
        user = await req.db.user.create({
          name: result.data.name,
          email: result.data.email,
          password: bcryptPassword,
        });

        const { userId } = user;
        await req.db.userVerify.create({
          userId: userId,
        });
      }

      const userVerify = await req.db.userVerify.findOne({
        where: { userId: user.userId },
      });

      await userVerify.update({
        emailVerified: true,
      });

      const _cu = encryptUserId(`${user.userId}`);
      const _cr = encryptUserId(`${user.role}`);

      const _tu = encryptToken(`${user.userId}`);
      const _tr = encryptToken(`${user.role}`);

      const token = jwt.sign({ _tu: _tu, _tr: _tr }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN,
      });

      const { emailVerified } = userVerify;

      res.status(200).json({
        success: true,
        message: "Амжилттай нэвтэрлээ!",
        AUTHtoken: token,
        emailVerified,
        _cu,
        _cr,
      });
    })
    .catch(async (err) => {
      res.status(401).json({
        success: false,
        error: {
          message: "Алдаа гарлаа. Та түр хүлээгээд дахин оролдоно уу!",
        },
      });
    });
});
