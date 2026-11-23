import React from "react";

const FormError = ({ id, children }) => {
  if (!children) return null;

  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 text-[11px] font-semibold text-tomato"
    >
      {children}
    </p>
  );
};

export default FormError;
