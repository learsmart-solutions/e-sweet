import React, { useState } from "react";
import { useReducedMotion } from "framer-motion";
import Hero from "../components/Hero";
import SiteNav from "../components/SiteNav";
import LandingPage from "../components/LandingPage";

const HomePage = () => {
  const [navVisible, setNavVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <main className="bg-cream">
      <SiteNav visible={navVisible || reduceMotion} />
      <Hero onNavChange={setNavVisible} />
      <LandingPage />
    </main>
  );
};

export default HomePage;
