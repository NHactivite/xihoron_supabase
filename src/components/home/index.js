// "use client";
// import Image from "next/image";
// import { useRef } from "react";
// import Details from "../DetailsAbout";
// import EventCard from "../EventCard";
// import { Button } from "../ui/button";

// const Home = ({ user, Event, Organizer }) => {
//   const competitionRef = useRef(null);

//   const scrollToCompetitions = () => {
//     competitionRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div className="bg-gradient-to-r from-[#0b1e3b] via-[#2b0b49] to-[#442b5c]">

//       <section>
//         <div className="min-h-screen flex-col bg-gradient-to-br from-[#0b1e3b] via-[#2b0b49] to-[#ff6a3d] flex items-center pt-32 sm:pt-44">
//           <h1 className="text-6xl sm:text-7xl lg:text-9xl font-bold text-white text-center px-4">
//             XIHORON V.1.0
//           </h1>
//           <div className="flex justify-center flex-col items-center mt-10 text-white text-center px-4">
//             <p>
//               The First Session. Hosted by the Department of Computer Science,
//               Sibsagar University
//             </p>
//             <p>
//               Join us for an unparalleled convergence of innovation, code, and
//               creativity.
//             </p>
//           </div>
//           <Button onClick={scrollToCompetitions} className="mt-5 text-2xl p-8">
//             Explore Events
//           </Button>
//         </div>
//       </section>

//       <section className="lg:gap-16 gap-10 my-8 mx-6 sm:mx-12 lg:mx-28 rounded-xl bg-gradient-to-r from-[#0b1e3b] via-[#2b0b49] to-[#442b5c]">
//         <Details />
//       </section>
//       <section ref={competitionRef} id="competitions">
//         <div className="lg:text-3xl text-2xl flex justify-center items-center my-16 mx-5 text-white">
//           <h1>Competitions & Workshops</h1>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
//           {Event.Event.map((i, idx) => (
//             <EventCard
//               key={idx}
//               poster={i.poster[0].url}
//               title={i.title}
//               description={i.description}
//               id={i._id}
//             />
//           ))}
//         </div>
//       </section>
//       <section className="pb-10">
//         <div className="text-3xl sm:text-4xl flex justify-center items-center my-16 mx-5 text-white">
//           <h1>Organizing Committee</h1>
//         </div>

//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-6">
//           {Organizer.Organizer.map((i, idx) => (
//             <div
//               key={idx}
//               className="bg-amber-50 flex flex-col items-center p-4 rounded-xl shadow"
//             >
//               <Image
//                 src={i.photo.url}
//                 alt={i.role}
//                 width={120}
//                 height={100}
//                 className="rounded-full object-cover border-4 border-amber-200"
//               />
//               <div className="text-center mt-3">
//                 <h1 className="text-xl font-semibold text-gray-800">
//                   {i.name}
//                 </h1>
//                 <span className="text-sm text-gray-600">{i.role}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;
"use client";
import Image from "next/image";
import { useRef } from "react";
import Details from "../DetailsAbout";
import EventCard from "../EventCard";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

const Home = ({  Event, Organizer }) => {
  const competitionRef = useRef(null);

  const scrollToCompetitions = () => {
    competitionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-r from-[#0b1e3b] via-[#2b0b49] to-[#442b5c]">
      <section>
        <motion.div
          className="min-h-screen flex-col bg-gradient-to-br from-[#0b1e3b] via-[#2b0b49] to-[#ff6a3d] flex items-center pt-32 sm:pt-44"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl sm:text-7xl lg:text-9xl font-bold text-white text-center px-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            XIHORON V.1.0
          </motion.h1>

          <motion.div
            className="flex justify-center flex-col items-center mt-10 text-white text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <p>
              The First Session. Hosted by the Department of Computer Science,
              Sibsagar University
            </p>
            <p>
              Join us for an unparalleled convergence of innovation, code, and
              creativity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Button onClick={scrollToCompetitions} className="mt-5 lg:text-2xl text-xl lg:p-8 p-6">
              Explore Events
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="lg:gap-16 gap-10 my-8 mx-6 sm:mx-12 lg:mx-28 rounded-xl bg-gradient-to-r from-[#0b1e3b] via-[#2b0b49] to-[#442b5c]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Details />
        </motion.div>
      </section>

      <section ref={competitionRef} id="competitions">
        <motion.div
          className="lg:text-3xl text-2xl flex justify-center items-center my-16 mx-5 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1>Competitions & Workshops</h1>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6"
          initial="hidden"
          whileInView="visible"
          transition={{ staggerChildren: 0.15 }}
          viewport={{ once: true }}
        >
          {Event.Event.map((i, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
            >
              <EventCard
                poster={i.poster[0].url}
                title={i.title}
                description={i.description}
                id={i._id}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="pb-10">
        <motion.div
          className="text-2xl sm:text-4xl flex justify-center items-center my-16 mx-5 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1>Organizing Committee</h1>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-6"
          initial="hidden"
          whileInView="visible"
          transition={{ staggerChildren: 0.15 }}
          viewport={{ once: true }}
        >
          {Organizer.Organizer.map((i, idx) => (
            <motion.div
              key={idx}
              className="bg-amber-50 flex flex-col items-center p-4 rounded-xl shadow"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={i.photo.url}
                alt={i.role}
                width={120}
                height={100}
                className="rounded-full object-cover border-4 border-amber-200"
              />
              <div className="text-center mt-3">
                <h1 className="text-xl font-semibold text-gray-800">
                  {i.name}
                </h1>
                <span className="text-sm text-gray-600">{i.role}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
