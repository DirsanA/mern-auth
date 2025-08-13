import React from "react";
import { assets } from "../assets/assets.js";

const Navbar = () => {
  return (
    <div className="top-0 absolute flex justify-between items-center p-4 sm:p-6 sm:px-24 w-full">
      <img src={assets.logo} alt="Logo of the page" className="w-28 sm:w-32" />
      <button className="flex gap-2 hover:bg-gray-100 px-6 py-2 border border-gray-500 rounded-full text-gray-800 transition-all itmes-center">
        Login <img src={assets.arrow_icon} alt="Login icon" />
      </button>
    </div>
  );
};

export default Navbar;
