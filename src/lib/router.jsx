import React, { useSyncExternalStore } from "react";

const normalizePath = (path) => {
  if (!path) return "/";
  const clean = path.replace(/\/+$/, "");
  return clean || "/";
};

const getPath = () =>
  typeof window === "undefined"
    ? "/"
    : normalizePath(window.location.pathname);

const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

export const navigate = (to, { replace = false, scroll = true } = {}) => {
  if (typeof window === "undefined") return;

  const url = new URL(to, window.location.origin);
  if (url.origin !== window.location.origin) {
    window.location.href = to;
    return;
  }

  const nextPath = normalizePath(url.pathname);
  const currentPath = getPath();
  const samePath = nextPath === currentPath;

  if (!samePath || url.search || url.hash) {
    const method = replace ? "replaceState" : "pushState";
    window.history[method](
      {},
      "",
      `${nextPath}${url.search}${url.hash}`,
    );
    emit();
  }

  if (scroll) {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
};

const subscribe = (onChange) => {
  listeners.add(onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
};

// useSyncExternalStore re-reads the path after subscribing, so a navigate()
// fired from a child's effect during the first render (effects run child
// first, before this hook has subscribed) is still picked up.
export const useRoute = () =>
  useSyncExternalStore(subscribe, getPath, () => "/");

export const Link = ({
  to,
  replace = false,
  scroll = true,
  onClick,
  children,
  ...props
}) => {
  const handleClick = (event) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank" ||
      props.download
    ) {
      return;
    }

    event.preventDefault();
    navigate(to, { replace, scroll });
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};
