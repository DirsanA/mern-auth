import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { user } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-gray-800 text-center">
      <img
        src={assets.header_img}
        alt="Header"
        className="mb-6 rounded-full w-36 h-36"
      />
      <h1 className="flex items-center gap-2 mb-2 font-medium text-xl sm:text-3xl">
        {user?.name || "Welcome to our site"} {/* Add fallback for name */}
        <img className="w-8 aspect-square" src={assets.hand_wave} alt="wave" />
      </h1>
      <h2 className="mb-4 font-semibold text-3xl sm:text-5xl">
        Welcome to Our App
      </h2>
      <p className="mb-8 max-w-md">
        Let's start with a quick product tour and we will have you up and
        running in no time.
      </p>
      <button className="hover:bg-gray-100 px-8 py-2.5 border border-gray-500 rounded-full transition-all">
        Get started
      </button>
    </div>
  );
};

export default Header;
