import React, { useState } from "react";
import { useReducedMotion } from "framer-motion";
import Hero from "./components/Hero";
import SiteNav from "./components/SiteNav";
import LandingPage from "./components/LandingPage";

const App = () => {
  const [navVisible, setNavVisible] = useState(false);
  // Reduced-motion users get the static hero, so the nav is always shown.
  const reduceMotion = useReducedMotion();

  return (
    <main className="bg-cream">
      <SiteNav visible={navVisible || reduceMotion} />
      <Hero onNavChange={setNavVisible} />
      <LandingPage />
    </main>
  );
};

export default App;
