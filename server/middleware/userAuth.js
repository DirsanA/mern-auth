import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const userAuth = async (req, res, next) => {
  try {
    // 1) Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await userModel.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists",
      });
    }

    // 4) Add user to request object
    req.user = currentUser;
    next();
  } catch (err) {
    console.error("Authentication error:", err);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please log in again",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error authenticating user",
    });
  }
};
