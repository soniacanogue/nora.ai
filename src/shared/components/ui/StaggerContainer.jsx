import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.4 } },
};

export const StaggerContainer = ({ children, className, as = "div" }) => {
  // If `as` is a string (like 'div', 'tbody', 'nav'), try to use the
  // corresponding `motion[...]` element. If `as` is a React component
  // (function/class), use `motion(as)` to create an animated version.
  const Component = typeof as === "string" ? (motion[as] || motion.div) : motion(as);

  return (
    <Component
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </Component>
  );
};

export const StaggerItem = ({ children, className, as = "div", ...props }) => {
  const Component = typeof as === "string" ? (motion[as] || motion.div) : motion(as);
  return (
    <Component variants={item} className={className} {...props}>
      {children}
    </Component>
  );
};
