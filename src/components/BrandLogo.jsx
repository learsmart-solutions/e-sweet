import React from "react";
import logo from "../assets/logo.png";

const BrandLogo = ({ className = "h-7 w-auto", light = false }) => {
  const image = (
    <img
      src={logo}
      alt="e'sweet"
      draggable={false}
      className={`${className} object-contain`}
    />
  );

  if (!light) return image;

  return (
    <span className="inline-flex items-center rounded-lg bg-cream px-2 py-1 shadow-sm">
      {image}
    </span>
  );
};

export default BrandLogo;
