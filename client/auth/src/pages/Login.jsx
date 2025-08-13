import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-200 to-purple-400 px-6 sm:px-0 min-h-screen">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="Logo"
        className="top-4 left-5 sm:left-20 absolute w-28 sm:w-32 cursor-pointer"
      />

      {/* Card */}
      <div className="bg-slate-900 shadow-lg p-10 rounded-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="mb-3 font-semibold text-white text-3xl text-center">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account"}
        </h2>
        <p className="mb-6 text-sm text-center">
          {state === "Sign Up"
            ? "Please fill in the details to sign up."
            : "Please enter your credentials to log in."}
        </p>

        {/* Form */}
        <form>
          {/* Show Full Name only on Sign Up */}
          {state === "Sign Up" && (
            <div className="flex items-center gap-3 bg-[#333A5C] mb-4 px-5 py-2.5 rounded-full w-full">
              <img src={assets.person_icon} alt="Person" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-transparent outline-none w-full text-white"
              />
            </div>
          )}

          <div className="flex items-center gap-3 bg-[#333A5C] mb-4 px-5 py-2.5 rounded-full w-full">
            <img src={assets.mail_icon} alt="Mail" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent outline-none w-full text-white"
            />
          </div>

          <div className="flex items-center gap-3 bg-[#333A5C] mb-4 px-5 py-2.5 rounded-full w-full">
            <img src={assets.lock_icon} alt="Lock" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent outline-none w-full text-white"
            />
          </div>

          {/* Forgot Password (Login only) */}
          {state === "Login" && (
            <p
              className="mb-4 text-indigo-500 hover:underline cursor-pointer"
              onClick={function () {
                navigate("/reset-password");
              }}
            >
              Forgot password?
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5 rounded-full w-full font-medium text-white"
          >
            {state}
          </button>

          {/* Switch between Sign Up and Login */}
          {state === "Sign Up" ? (
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <span
                className="text-blue-500 underline cursor-pointer"
                onClick={() => setState("Login")}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="mt-4 text-center">
              Don’t have an account?{" "}
              <span
                className="text-blue-500 underline cursor-pointer"
                onClick={() => setState("Sign Up")}
              >
                Sign Up
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
