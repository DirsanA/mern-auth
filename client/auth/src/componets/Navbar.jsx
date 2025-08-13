import React from "react";
import { assets } from "../assets";

const Navbar = () => {
  return (
    <div>
      <img src={assets.logo} alt="Logo of the page" className="w-28" />
    </div>
  );
};

export default Navbar;
