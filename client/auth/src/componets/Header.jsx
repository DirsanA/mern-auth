import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div>
      <img
        src={assets.header_img}
        alt="Header image"
        className="mb-6 rounded-full w-36 h-36"
      />
      <h1>
        Hey Developer{" "}
        <img className="w-8 aspect-square" src={assets.hand_wave} alt="" />
      </h1>
    </div>
  );
};

export default Header;
