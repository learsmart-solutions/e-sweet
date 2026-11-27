// One order-number generator for checkout and the store. Six digits keep the
// code readable on the confirmation screen while making accidental collisions
// far less likely than the old four-digit code.
export const createOrderCode = () =>
  `ES-${Math.floor(100000 + Math.random() * 900000)}`;
