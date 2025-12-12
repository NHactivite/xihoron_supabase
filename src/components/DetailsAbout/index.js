"use client";

import { useState } from "react";

const Details = () => {
  const [activeTab, setActiveTab] = useState("xihorn");

  return (
      <section className="lg:gap-16 gap-10 my-8 lg:ml-28 rounded-xl">
      {/* Tabs */}
      <div className="relative flex lg:text-3xl text-xl gap-10 ml-5 text-gray-300 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("xihorn")}
          className={`pb-2 transition-all duration-300 ${
            activeTab === "xihorn"
              ? "text-white border-b-4 border-blue-500"
              : "hover:text-white"
          }`}
        >
          About Xihorn
        </button>
        <button
          onClick={() => setActiveTab("department")}
          className={`pb-2 transition-all duration-300 ${
            activeTab === "department"
              ? "text-white border-b-4 border-blue-500"
              : "hover:text-white"
          }`}
        >
          About Department
        </button>
      </div>

      {/* Content */}
      {activeTab === "xihorn" && (
        <div className="flex flex-col justify-center mt-5 ml-5 animate-fadeIn">
          <h1 className="text-2xl text-white mt-5">Welcome to XIHORON V.1.0</h1>
          <p className="text-lg mt-3 text-justify text-gray-300 leading-relaxed max-w-5xl">
            XIHORON, meaning "convergence" in Assamese, marks the first-ever
            session of our department's flagship technical festival. It's more
            than just a fest; it's a celebration of the spirit of computer
            science and a platform for brilliant minds to showcase their
            talents, collaborate, and push the boundaries of technology. From
            intense coding battles and robotic warfare to insightful workshops
            on cutting-edge AI, XIHORON V.1.0 brings together a diverse spectrum
            of events designed to challenge, inspire, and educate. Join us as we
            ignite the future, one idea at a time.
          </p>
        </div>
      )}

      {activeTab === "department" && (
        <div className="flex flex-col justify-center mt-5 ml-5 animate-fadeIn">
          <h1 className="text-2xl text-white mt-5">
            Department of Computer Science, Sibsagar University
          </h1>
          <p className="text-lg text-justify mt-3 text-gray-300 leading-relaxed max-w-5xl">
            Established in 2022, the Department of Computer Science at
            Sibsagar University has been at the forefront of technological
            education and research in the region. Our mission is to cultivate a
            rich learning environment that fosters innovation, critical
            thinking, and technical excellence. With state-of-the-art
            laboratories, a distinguished faculty, and a strong focus on both
            theoretical foundations and practical application, we are dedicated
            to preparing our students to become the next generation of tech
            leaders, innovators, and problem-solvers.
          </p>
        </div>
      )}
    </section>
  );
};

export default Details;
