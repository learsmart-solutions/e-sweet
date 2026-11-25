export const formatNaira = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;
