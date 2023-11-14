import banner from "../assets/banner.png";
import React from "react";
const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="flex items-center"
          onClick={() => {
            window.location.assign((window.location.href = "/"));
          }}
        >
          <img src={banner} alt="banner" className="h-12 mr-3" />
          <h1 className="text-white text-lg md:text-3xl font-bold cursor-pointer">
            Cloud
          </h1>
        </div>

        <button
          className="text-white md:font-semibold mx-6 text-center md:text-xl text-sm"
          onClick={() => {
            window.open("https://linktr.ee/luvnft", "_blank");
          }}
        >
          💥LUV NFT💥
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
