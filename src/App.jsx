import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Hero from "./components/Hero";
import SiteNav from "./components/SiteNav";
import LandingPage from "./components/LandingPage";

const App = () => {
  // Updated E-Sweet website
  const [navVisible, setNavVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) setNavVisible(true);
  }, [reduceMotion]);

  return (
    <main className="bg-cream">
      <SiteNav visible={navVisible || reduceMotion} />
      <Hero onNavChange={setNavVisible} />
      <LandingPage />
    </main>
  );
};

export default App;
