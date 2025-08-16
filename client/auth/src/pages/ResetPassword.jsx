import React from "react";

import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const inputRef = React.useRef([]);
  const { backendUrl, getUser, isLoggedIn, user } =
    React.useContext(AppContext);
  const [isEmailSent, setIsEmailSent] = React.useState(false);

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (e.target.value === "" && index > 0) {
        inputRef.current[index - 1].focus();
      } else {
        e.target.value = ""; // Clear current box
      }
    }
  };

  const handleInput = (e, index) => {
    e.target.value = e.target.value.replace(/\D/g, ""); // Allow only digits
    if (e.target.value.length === 1 && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "") // Only numbers
      .slice(0, 6); // Max 6 digits

    pasteData.split("").forEach((char, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = char;
      }
    });

    // Move focus to the last filled box
    const lastFilledIndex = pasteData.length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < 6) {
      inputRef.current[lastFilledIndex].focus();
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-200 to-purple-400 p-4 min-h-screen">
      <img
        src={assets.logo}
        alt="Logo"
        className="top-5 left-5 sm:left-5 absolute w-24 sm:w-28 cursor-pointer"
      />

      <form className="bg-slate-900 shadow-xl p-6 py-10 rounded-2xl w-full max-w-xs text-sm">
        <h1 className="mb-4 font-bold text-white text-2xl text-center">
          Reset Password
        </h1>

        <p className="mb-5 text-indigo-200 text-sm text-center">
          Please enter your registered email address
        </p>

        <div className="flex items-center gap-2 bg-[#333A5C] mb-4 px-4 py-2 rounded-full w-full">
          <img src={assets.mail_icon} alt="Email Icon" className="w-4 h-4" />
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 shadow-md py-2 rounded-lg w-full font-medium text-white text-sm transition duration-200"
        >
          Submit
        </button>
      </form>
      {/* otp input */}

      <form className="bg-slate-900 shadow-lg p-8 rounded-lg w-96 text-sm">
        <h1 className="mb-4 font-semibold text-white text-2xl text-center">
          Password Reset OTP
        </h1>
        <p className="mb-6 text-indigo-100 text-center">
          Please enter the OTP sent to your email address.
        </p>
        <div className="flex justify-between mb-8">
          {Array.from({ length: 6 }, (_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              ref={(el) => (inputRef.current[index] = el)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onInput={(e) => handleInput(e, index)}
              onPaste={handlePaste}
              required
              className="border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 w-12 h-12 text-white text-lg text-center"
            />
          ))}
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg w-full text-white transition duration-200">
          Submit
        </button>
      </form>

      {/* Enter new password form */}
      <form className="bg-slate-900 shadow-xl p-6 py-10 rounded-2xl w-full max-w-xs text-sm">
        <h1 className="mb-4 font-bold text-white text-2xl text-center">
          Enter New Password
        </h1>

        <p className="mb-5 text-indigo-200 text-sm text-center">
          Please enter your new password
        </p>

        <div className="flex items-center gap-2 bg-[#333A5C] mb-4 px-4 py-2 rounded-full w-full">
          <img src={assets.lock_icon} alt="Lock Icon" className="w-4 h-4" />
          <input
            type="password"
            placeholder="Enter New Password"
            required
            className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 shadow-md py-2 rounded-lg w-full font-medium text-white text-sm transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
