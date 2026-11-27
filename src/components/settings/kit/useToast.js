import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tiny toast state for the Settings pages.
 *
 *   const { toast, showToast } = useToast();
 *   showToast("Name updated");               // success
 *   showToast("Photo didn't upload.", "error");
 *   <Toast toast={toast} />
 *
 * Only one toast shows at a time; a new one replaces the old one and
 * restarts the timer.
 */
export const useToast = (duration = 3200) => {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const hideToast = useCallback(() => {
    clearTimeout(timer.current);
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message, tone = "success") => {
      clearTimeout(timer.current);
      setToast({ id: Date.now(), message, tone });
      timer.current = setTimeout(() => setToast(null), duration);
    },
    [duration],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return { toast, showToast, hideToast };
};

export default useToast;
