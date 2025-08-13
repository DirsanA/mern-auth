import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await userModel.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists",
      });
    }

    req.userId = currentUser._id; // ✅ store only the ID
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
