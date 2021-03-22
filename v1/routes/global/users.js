const express = require("express");
const { protect, authorize } = require("../../middleware/protect");

const {
  getUsers,
  getUser,
  createUserStaff,
  updateUserStaff,
  deleteUserStaff,
} = require("../../controller/user/userStaffs");

const {
  registerUser,
  updateCommonUser,
  updateCommonEmail,
  updateCommonUserEmail,
  updateCommonUserCurrentEmail,
} = require("../../controller/user/userCommon");

const {
  staffLogin,
  staffLogout,
  checkLogin,
  loginUser,
  emailVerify,
  reSendEmailVerification,
  updateLoginEmail,
} = require("../../controller/user/userLogin");

// Хэрэглэгчийн түрээсэлсэн заалны түүхүүд
const {
  getOrderSportHalls,
} = require("../../controller/halls/sportHall/orderSportHalls");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("superadmin"), getUsers)
  .post(protect, authorize("superadmin"), createUserStaff);

router
  .route("/:id")
  .get(protect, authorize("superadmin"), getUser)
  .put(protect, authorize("superadmin"), updateUserStaff)
  .delete(protect, authorize("superadmin"), deleteUserStaff);

router.route("/:id/orderhalls").get(getOrderSportHalls);

router.route("/register").post(registerUser);

router.route("/:id/update").put(updateCommonUser);

router.route("/signin").post(staffLogin);

router.route("/signout").post(staffLogout);

router.route("/login").post(loginUser);

router.route("/checklogin").post(checkLogin);

router
  .route("/:id/emailverify")
  .post(emailVerify)
  .get(reSendEmailVerification)
  .put(updateLoginEmail);

router
  .route("/:id/emailchange")
  .get(updateCommonUserCurrentEmail)
  .post(updateCommonUserEmail)
  .put(updateCommonEmail);

module.exports = router;
