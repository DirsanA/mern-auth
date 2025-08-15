import React from "react";
import { assets } from "../assets/assets";

const EmailVerify = () => {
  const inputRef = React.useRef([]);

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
    if (e.target.value.length === 1 && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "") // only numbers
      .slice(0, 6); // max 6 digits

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

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const otp = inputRef.current.map((input) => input.value).join("");
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-200 to-purple-400 min-h-screen">
      <img
        src={assets.logo}
        alt=""
        className="top-5 left-5 sm:left-5 absolute w-28 sm:w-32 cursor-pointer"
      />
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 shadow-lg p-8 rounded-lg w-96 text-sm"
      >
        <h1 className="mb-4 font-semibold text-white text-2xl text-center">
          Email Verify OTP
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
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
