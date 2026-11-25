import React from "react";
import { getItemImage } from "./orderUtils";

const OrderThumbnail = ({ item, size = 44, className = "" }) => {
  const image = getItemImage(item);
  const label = item?.name?.trim()?.[0]?.toUpperCase() || "E";

  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-[10px] bg-[#FAF2EB] ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {image ? (
        <img
          src={image}
          alt=""
          width={size}
          height={size}
          className="size-full object-cover"
        />
      ) : (
        <span className="font-display text-[15px] font-extrabold text-tomato">
          {label}
        </span>
      )}
    </span>
  );
};

export default OrderThumbnail;
