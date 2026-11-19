import React from "react";
import logo from "../assets/logo.png";

const BrandLogo = ({ className = "h-7 w-auto", light = false }) => (
  <img
    src={logo}
    alt="e'sweet"
    draggable={false}
    className={`${className} object-contain ${light ? "brightness-0 invert" : ""}`}
  />
);

export default BrandLogo;
