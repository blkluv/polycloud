// src/Navbar.js

import React from "react";
const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-white text-2xl md:text-3xl font-bold cursor-pointer"
          onClick={() => {
            window.location.assign((window.location.href = "/"));
          }}
        >
          PolyCloud V2
        </h1>

        <button
          className="text-white md:font-semibold mx-6 text-center md:text-xl"
          onClick={() => {
            window.open("https://linktr.ee/ayaaneth", "_blank");
          }}
        >
          💥Connect with Dev💥
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
