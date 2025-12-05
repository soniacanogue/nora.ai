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
  const Component = motion[as] || motion.div;
  // If 'as' is a string like 'tbody', motion.tbody exists.
  // If it's a component, we might need to wrap it or use motion(Component)
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
  const Component = motion[as] || motion.div;
  return (
    <Component variants={item} className={className} {...props}>
      {children}
    </Component>
  );
};
