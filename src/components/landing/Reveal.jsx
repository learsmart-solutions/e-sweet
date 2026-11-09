import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const Reveal = ({
  children,
  className = "",
  delay = 0,
  y = 28,
  once = true,
  amount = 0.25,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.75, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
