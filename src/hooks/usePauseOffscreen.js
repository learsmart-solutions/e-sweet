import { useEffect } from "react";

// Pauses every CSS animation inside `ref` while it is off-screen by toggling a
// data attribute (see `[data-offscreen]` in index.css). Writing the attribute
// directly keeps scroll free of React re-renders.
export const usePauseOffscreen = (ref, rootMargin = "200px 0px") => {
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        node.toggleAttribute("data-offscreen", !entry.isIntersecting);
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      node.removeAttribute("data-offscreen");
    };
  }, [ref, rootMargin]);
};

export default usePauseOffscreen;
