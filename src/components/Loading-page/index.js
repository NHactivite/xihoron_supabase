// "use client";
// import { AnimatePresence, motion } from "framer-motion";

// const LoadingAnimation = () => {
//   const loadingVariants = {
//     initial: { opacity: 1 },
//     exit: {
//       opacity: 0,
//       scale: 1.2,
//       transition: { duration: 0.8, ease: "easeInOut" },
//     },
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         className="fixed inset-0 z-50 flex items-center justify-center "
//         variants={loadingVariants}
//         initial="initial"
//         exit="exit"
//       >
//         {/* Flower-like Spinner */}
//         <motion.svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-20 h-20 text-red-600"
//           viewBox="0 0 100 100"
//           fill="none"
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
//         >
//           <circle cx="50" cy="50" r="5" fill="currentColor" />
//           {[...Array(8)].map((_, i) => {
//             const angle = (i * 360) / 8;
//             const x = 50 + 30 * Math.cos((angle * Math.PI) / 180);
//             const y = 50 + 30 * Math.sin((angle * Math.PI) / 180);
//             return (
//               <circle
//                 key={i}
//                 cx={x}
//                 cy={y}
//                 r="6"
//                 fill="currentColor"
//                 opacity={0.7}
//               />
//             );
//           })}
//         </motion.svg>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default LoadingAnimation;
