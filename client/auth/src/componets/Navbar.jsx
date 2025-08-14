import { useContext } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";

const Navbar = () => {
  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verification`
      );
      if (data.success) {
        navigate("/verify-otp");
        toast.success("Verification OTP sent");
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (error) {
      toast.error(error.message || "Verification failed");
    }
  };
  const navigate = useNavigate();
  const { user, backendUrl, setUser, setIsLoggedIn } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setUser({}); // keep consistent with AppContext initial value
        setIsLoggedIn(false);
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <div className="top-0 absolute flex justify-between items-center p-4 sm:p-6 sm:px-24 w-full">
      <img src={assets.logo} alt="Logo of the page" className="w-28 sm:w-32" />

      {user && user.name ? (
        <div className="group relative flex justify-center items-center bg-black rounded-full w-8 h-8 text-white cursor-pointer">
          {user.name[0].toUpperCase()}
          <div className="hidden group-hover:block top-full right-0 z-10 absolute pt-2">
            <ul className="bg-gray-100 shadow-lg p-2 rounded text-sm list-none">
              {!user.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="hover:bg-gray-200 px-2 py-1 text-gray-800 cursor-pointer"
                >
                  Verify Email
                </li>
              )}
              <li
                onClick={handleLogout}
                className="hover:bg-gray-200 px-2 py-1 text-gray-800 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 hover:bg-gray-100 px-6 py-2 border border-gray-500 rounded-full text-gray-800 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="Login icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
