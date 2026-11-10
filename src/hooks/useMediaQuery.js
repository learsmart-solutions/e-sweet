import { useEffect, useState } from "react";

const getMatch = (query) =>
  typeof window !== "undefined" && window.matchMedia(query).matches;

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => getMatch(query));

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);

    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
};

export default useMediaQuery;
