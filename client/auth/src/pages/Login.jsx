import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUser } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (state === "Sign Up") {
        // Handle registration
        await axios.post(
          `${backendUrl}/api/auth/register`,
          { name, email, password },
          { withCredentials: true }
        );
        toast.success("Registration successful! Please login.");
        setState("Login");
        navigate("/");
        await getUser(); //
      } else {
        // Handle login
        const { data } = await axios.post(
          `${backendUrl}/api/auth/login`,
          { email, password },
          { withCredentials: true }
        );

        if (data.success) {
          await getUser(); // Fetch user data after successful login
          toast.success(`Welcome back, ${data.user?.name || "User"}!`);
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(
        error.response?.data?.message ||
          (state === "Sign Up" ? "Registration failed" : "Login failed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-200 to-purple-400 px-6 sm:px-0 min-h-screen">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="Logo"
        className="top-4 left-5 sm:left-20 absolute w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* Auth Card */}
      <div className="bg-slate-900 shadow-lg p-8 rounded-lg w-full sm:w-96 text-indigo-300">
        <h2 className="mb-3 font-semibold text-white text-3xl text-center">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="mb-6 text-sm text-center">
          {state === "Sign Up"
            ? "Join our community today"
            : "Sign in to continue"}
        </p>

        <form onSubmit={handleSubmit}>
          {state === "Sign Up" && (
            <div className="flex items-center gap-3 bg-[#333A5C] mb-4 px-5 py-3 rounded-full">
              <img src={assets.person_icon} alt="Person" className="w-5" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-transparent outline-none w-full text-white placeholder-gray-400"
              />
            </div>
          )}

          <div className="flex items-center gap-3 bg-[#333A5C] mb-4 px-5 py-3 rounded-full">
            <img src={assets.mail_icon} alt="Mail" className="w-5" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent outline-none w-full text-white placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 bg-[#333A5C] mb-6 px-5 py-3 rounded-full">
            <img src={assets.lock_icon} alt="Lock" className="w-5" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-transparent outline-none w-full text-white placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-full font-medium text-white transition-colors ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Processing..." : state}
          </button>

          <div className="mt-4 text-sm text-center">
            {state === "Sign Up" ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setState("Login")}
                  className="text-blue-400 hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <>
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setState("Sign Up")}
                    className="text-blue-400 hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="mt-2 text-blue-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
