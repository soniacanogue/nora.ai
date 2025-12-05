import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function RollingNumber({ value }) {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  const spring = useSpring(0, { bounce: 0, duration: 2000 }); // Slower for effect
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    if (!isNaN(numericValue)) {
      spring.set(numericValue);
    }
  }, [spring, numericValue]);

  return <motion.span>{display}</motion.span>;
}
