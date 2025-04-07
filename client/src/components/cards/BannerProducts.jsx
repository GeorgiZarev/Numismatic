import React from "react";
import { assets } from "../../Assets/ObjFile";

const Banner = () => {
  return (
    <div className="relative w-full h-[400px] pt-[70px] pb-[70px]">
      <img
        src={assets.banner}
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <div className="relative z-10 flex items-center justify-center h-full text-white"></div>
    </div>
  );
};

export default Banner;
