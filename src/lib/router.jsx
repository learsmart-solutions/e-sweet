import React, { useEffect, useState } from "react";

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

export const useRoute = () => {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const update = () => setPath(getPath());
    listeners.add(update);
    window.addEventListener("popstate", update);
    return () => {
      listeners.delete(update);
      window.removeEventListener("popstate", update);
    };
  }, []);

  return path;
};

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
