import React from "react";
import Marquee from "./landing/Marquee";
import Story from "./landing/Story";
import DishRail from "./landing/DishRail";
import HowItWorks from "./landing/HowItWorks";
import Testimonials from "./landing/Testimonials";
import Visit from "./landing/Visit";
import HungryYet from "./landing/HungryYet";
import Footer from "./landing/Footer";

const LandingPage = () => (
  <>
    <Marquee />
    <Story />
    <DishRail />
    <HowItWorks />
    <Testimonials />
    <Visit />
    <HungryYet />
    <Footer />
  </>
);

export default LandingPage;
