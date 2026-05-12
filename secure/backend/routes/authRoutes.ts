import express from "express";
import {
  signup,
  login,
  verifyOTP,
  refreshToken,
  logout,
  resendOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
