"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from 'react'; // Added explicit React import for hooks

// --- Symbol Icons ---
// You can replace these with icons from libraries like lucide-react or react-icons
const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-12 h-12"
  >
    {/* Angle Brackets */}
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
); 

const PaletteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-12 h-12"
  >
    {/* Palette for Art/Design */}
    <circle cx="12" cy="12" r="10" />
    <path d="M18 10a5.25 5.25 0 0 0-4.47-5.25A5 5 0 0 0 10.75 4c-.93 0-1.8.31-2.5.83M6 10a5 5 0 0 0 5 5h1a5 5 0 0 0 5-5" />
    <path d="M15 15v.01" />
    <path d="M9 18v.01" />
  </svg>
); 

const CompassIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-12 h-12"
  >
    {/* Compass for Planning/General Events */}
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
); 


const icons = [
  { id: "code", component: CodeIcon, color: "text-blue-400" },      // For Code Events
  { id: "art", component: PaletteIcon, color: "text-fuchsia-400" }, // For Art/Creation Events
  { id: "general", component: CompassIcon, color: "text-cyan-400" }, // For General/Planning Events
];

const LoadingAnimation = ({ duration = 3.0 }) => {
  // Variants for the overall container exit animation
  const containerVariants = {
    initial: { opacity: 1 },
    exit: {
      opacity: 0,
      scale: 1.05, // Slightly less dramatic exit scale for dark mode
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  // Variants for the individual icon fade/rotate animation
  const iconVariants = {
    initial: { opacity: 0, scale: 0.8, rotate: -45 },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotate: 45,
      transition: {
        duration: 0.7,
        ease: "easeIn",
      },
    },
  };
  
  // Calculate timing for icon cycling
  const transitionTime = duration / icons.length;

  const [currentIconIndex, setCurrentIconIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, transitionTime * 1000); 

    return () => clearInterval(interval);
  }, [transitionTime]); 

  const currentIcon = icons[currentIconIndex];
  const IconComponent = currentIcon.component;

  return (
    <AnimatePresence>
      <motion.div
        // --- Dark Background Change ---
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-md" 
        variants={containerVariants}
        initial="initial"
        exit="exit"
      >
        <div className="relative w-20 h-20 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIcon.id}
              className={`absolute ${currentIcon.color}`} 
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <IconComponent />
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Loading text in a bright color for contrast */}
        <motion.p 
            className="mt-6 text-lg font-light tracking-wider text-gray-200"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
           Loading...
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingAnimation;