import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendVerificationEmail,
  verifyOtp,
  isAuthenticated,
  resetOtpSend,
  resetPassword,
} from "../controller/authController.js";
import { userAuth } from "../middleware/userAuth.js";

const authRouter = express.Router();

// Public routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);

// Protected routes (require authentication)
authRouter.post("/send-verification", userAuth, sendVerificationEmail);
authRouter.post("/verify-otp", userAuth, verifyOtp);
authRouter.get("/check-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", resetOtpSend);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
