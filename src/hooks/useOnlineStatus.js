import { useSyncExternalStore } from "react";

const subscribe = (onChange) => {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
};

const getSnapshot = () => navigator.onLine;
const getServerSnapshot = () => true;

// True while the browser reports a network connection. `navigator.onLine`
// can say "online" on a network with no internet, so a failed request is
// still the final word; this is for reacting the moment the device drops
// off or comes back.
export const useOnlineStatus = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export default useOnlineStatus;
