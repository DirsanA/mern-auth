import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    // 1️⃣ Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 2️⃣ Hash password & save new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    // 3️⃣ Create JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 4️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    });

    // 5️⃣ Prepare welcome email
    const mailOption = {
      from: process.env.SEND_EMAIL,
      to: email,
      subject: "Welcome to Our Service",
      text: `Hello ${name},\n\nThank you for registering!`,
      html: `<p>Hello <strong>${name}</strong>,</p><p>Thank you for registering!</p>`,
    };

    // 6️⃣ Try sending email
    try {
      await transporter.sendMail(mailOption);
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr);
    }

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    });

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function logoutUser(req, res) {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logout successful" });
}

// sending verification to user email
export async function sendVerificationEmail(req, res) {
  try {
    const { userId } = req.body;

    // if (!userId) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "User ID is required" });
    // }
    const user = await userModel.findById(userId);
    if (!user) {
      console.error("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.accountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otp = otp; // storing the otp to the user document
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // setting expiry time to 24 hours

    await user.save();

    const mailOptions = {
      from: process.env.SEND_EMAIL,
      to: user.email,
      subject: "Verify your email",
      text: `Your OTP is ${otp}. It is valid for 24 hours.`,
      html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 24 hours.</p>`,
    };

    // 6️⃣ Try sending email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ OTP sent to ${user.email}`);
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr);
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function verifyOtp(req, res) {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    console.log("Missing fields");
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.accountVerified = true;
    user.otp = undefined;
    user.verifyOtpExpireAt = undefined;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Account verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
