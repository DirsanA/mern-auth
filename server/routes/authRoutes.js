import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendVerificationEmail,
  verifyOtp,
} from "../controller/authController.js";

const authRouter = express.Router();

// Public routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);

// OTP routes — no auth required
authRouter.post("/verify-otp", sendVerificationEmail);
authRouter.post("/verify-account", verifyOtp);

export default authRouter;
