import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplete.js";

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Helper function to set cookie
const setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };
  res.cookie("token", token, cookieOptions);
};

// ✅ Register User
export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  // Validate input
  if (!email || !name || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email, and password",
    });
  }

  try {
    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Create new user
    const newUser = await userModel.create({ name, email, password });

    // Generate token and set cookie
    const token = generateToken(newUser._id);
    setTokenCookie(res, token);

    // Send welcome email (don't await to avoid blocking response)
    const mailOptions = {
      from: process.env.SEND_EMAIL,
      to: newUser.email,
      subject: "Welcome to Our Service",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome, ${newUser.name}!</h2>
          <p>Thank you for registering with our service.</p>
          <p>Your account has been successfully created.</p>
          <p style="margin-top: 30px;">Best regards,<br>The Team</p>
        </div>
      `,
    };

    transporter
      .sendMail(mailOptions)
      .then(() => console.log(`Welcome email sent to ${newUser.email}`))
      .catch((err) => console.error("Email sending error:", err));

    // Respond without sensitive data
    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAccountVerified: newUser.isAccountVerified,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}

// ✅ Login User
export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // // Verify password
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid credentials",
    //   });
    // }

    // Generate token and set cookie
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// ✅ Logout User
export async function logoutUser(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

export async function sendVerificationEmail(req, res) {
  // ✅ Get the ID from middleware instead of req.body
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No user ID found",
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save OTP to user
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send email with OTP
    const mailOptions = {
      from: process.env.SEND_EMAIL,
      to: user.email,
      subject: "Your Verification Code",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}", user.email).replace(
        "{{otp}}",
        otp
      ),
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Verification email sent",
    });
  } catch (err) {
    console.error("Send verification error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send verification email",
    });
  }
}

export async function verifyOtp(req, res) {
  const { otp } = req.body;
  const userId = req.userId; // from userAuth

  if (!userId || !otp) {
    return res.status(400).json({
      success: false,
      message: "User ID and OTP are required",
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp || new Date(user.otpExpiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.isAccountVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      data: {
        id: user._id,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
}

// ✅ Check Authentication Status
export async function isAuthenticated(req, res) {
  try {
    const user = req.user; // comes from middleware

    res.status(200).json({
      success: true,
      message: "User is authenticated",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.error("Authentication check error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking authentication status",
    });
  }
}

// send reset otp

export async function resetOtpSend(req, res) {
  const { email } = req.body;

  // 1. Validate input
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  try {
    // 2. Find user (case-insensitive search)
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists for security
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a reset OTP has been sent",
      });
    }

    // 3. Generate and save OTP
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetOtpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetOtp = resetOtp;
    user.resetOtpExpiresAt = resetOtpExpiresAt;
    await user.save();

    // 4. Send email (async - don't await)
    const mailOptions = {
      from: process.env.SEND_EMAIL,
      to: user.email,
      subject: "Your Password Reset Code",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", resetOtp).replace(
        "{{email}}",
        user.email
      ),
    };

    transporter
      .sendMail(mailOptions)
      .then(() => console.log(`Reset OTP sent to ${user.email}`))
      .catch((err) => console.error("Error sending reset email:", err));

    // 5. Respond (don't wait for email to send)
    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a reset OTP has been sent",
    });
  } catch (error) {
    console.error("Reset OTP send error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
}

export async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide email, otp, and new password",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpiresAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    // Directly save the new password (no hashing)
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiresAt = undefined;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
