import React from "react";
import { getInitial } from "../settingsStyles";

// Round avatar: the person's photo when they have one, otherwise the red
// circle with their initial (the same look as the Settings sidebar).
//
// NOTE: SettingsSidebar and ProfileSummary still draw the initial only. Swap
// them to this component to show the photo there too.
const Avatar = ({ name, photo, size = 80, className = "" }) =>
  photo ? (
    <img
      src={photo}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-full bg-sand object-cover ${className}`}
    />
  ) : (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.44 }}
      className={`grid shrink-0 place-items-center rounded-full bg-tomato font-display font-extrabold text-cream-light ${className}`}
    >
      {getInitial(name)}
    </span>
  );

export default Avatar;
