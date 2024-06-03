const express = require("express");
const router = express.Router();
const { signupController, loginController,logoutController, testController, sendOTP, adminTestController, customerTestController, forgotPassword, getResetPasswordToken, resetPasswordByToken } = require("../controllers/auth");
const {auth,isCustomer,isAdmin} = require("../middlewares/auth");

router.post("/register", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/verify-email", sendOTP);
router.put("/forgot-password", forgotPassword);
// router.post("/getResetPasswordToken", getResetPasswordToken);
// router.post("/resetPasswordByToken", resetPasswordByToken);

router.get("/dashboard",auth ,testController);
router.get("/admin/dashboard",auth,isAdmin,adminTestController);
router.get("/user/dashboard",auth,isCustomer,customerTestController);
module.exports = router;
