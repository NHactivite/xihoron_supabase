"use client";
import { AnimatePresence, motion } from "framer-motion";

const LoadingAnimation = () => {
  const loadingVariants = {
    initial: { opacity: 1 },
    exit: {
      opacity: 0,
      scale: 1.2,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600"
          variants={loadingVariants}
          initial="initial"
          exit="exit"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-white text-4xl font-bold"
          >
            Flower
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default LoadingAnimation;
