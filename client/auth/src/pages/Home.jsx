import React from "react";
import Navbar from "../componets/Navbar";
import Header from "../componets/Header";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-[url('/bg_img.png')] bg-cover bg-center min-h-screen">
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
