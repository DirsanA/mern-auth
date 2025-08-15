import React from "react";
import { assets } from "../assets/assets";
const ResetPassword = () => {
  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-200 to-purple-400 p-4 min-h-screen">
      <img
        src={assets.logo}
        alt="Logo"
        className="top-5 left-5 sm:left-5 absolute w-28 sm:w-32 cursor-pointer"
      />

      <form className="bg-slate-900 shadow-xl p-8 rounded-2xl w-full max-w-sm text-sm">
        <h1 className="mb-4 font-bold text-white text-3xl text-center">
          Reset Password
        </h1>

        <p className="mb-6 text-indigo-200 text-sm text-center">
          Please enter your registered email address
        </p>

        <div className="mb-6">
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="bg-slate-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-white transition placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg py-3 rounded-lg w-full font-semibold text-white transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
