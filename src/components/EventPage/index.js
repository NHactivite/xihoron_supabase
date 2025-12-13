"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaRupeeSign } from "react-icons/fa"

export default function EventPage({ Event }) {
  const [selectedTab, setSelectedTab] = useState("rules")
  const [includes, setIncludes] = useState([])


  useEffect(() => {
    setIncludes(Event.Event.participationFee.includes)
  }, [])


  return (
    <main className="min-h-screen bg-gradient-to-r from-orange-400 to-[#60338a] relative">
      {/* Hero section */}
      <motion.section
        className="pt-5 px-4 sm:px-6 lg:px-8 border-b border-border"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="lg:text-4xl text-xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {Event.Event.title} Championship
          </motion.h1>
          <motion.p
            className="text-sm mb-5 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {Event.Event.description}
          </motion.p>
        </div>
      </motion.section>

      <Link
        href={`/join/${Event.Event._id}`}
        className="absolute lg:right-40 right-1 top-3 bg-gray-100 text-gray-900 font-bold text-xl hover:bg-gray-100 w-20 pl-4 py-1 rounded-md"
      >
        Join
      </Link>

      {/* Key Info Cards */}
      <motion.section
        className="py-5 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.15 }}
            viewport={{ once: true }}
          >
            {/* Date/Time Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-6 transition bg-gray-800 text-gray-200 border-none">
                <div className="flex items-start gap-4">
                  <Clock />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Event Date & Time</h3>
                    <p className="font-semibold mb-1">
                      Event Start on {Event.Event.eventDateTime.date}
                    </p>
                    <p className="font-semibold">
                      Time {Event.Event.eventDateTime.startTime} - {Event.Event.eventDateTime.endTime}
                    </p>
                    <p className="font-semibold mt-2">
                      Registration End: {`${Event.Event.eventDateTime.registrationLastdate} ${Event.Event.eventDateTime.registrationTime}`}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Team Size Card */}
            {Event.Event.teamSize.teamLeadRequired ? (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 bg-gray-800 text-gray-200 border-none transition">
                  
                <div className="flex items-start gap-4">
                  <Users className="w-8 h-8 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Team Size</h3>
                    <p className="mb-1">
                      Minimum: {Event.Event.teamSize.min} members
                    </p>
                    <p className="font-semibold">
                      Maximum: {Event.Event.teamSize.max} members
                    </p>
                  
                      <p className="text-sm mt-2">1 team lead required</p>
                    
                  </div>
                </div>
              </Card>
            </motion.div>
            ) : null}

            {/* Fee Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6 bg-gray-800 text-gray-200 border-none transition">
                <div className="flex items-start gap-4">
                  <FaRupeeSign className="w-8 h-8 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Participation Fee</h3>
                    <p className="font-semibold text-2xl">
                      ₹ {Event.Event.participationFee.perTeam} Per Team
                    </p>
                    {includes?.length>0?
                     <p className="mt-2">
                      {includes.map((i, idx) => (
                        <span key={idx}>{i} </span>
                      ))}
                      Need Carry
                    </p>
                    :null}
                    
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Tabs Section */}
      <motion.section
        className="py-5 px-4 sm:px-6 lg:px-8 border-t border-border"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Tab buttons */}
          <motion.div
            className="flex gap-4 mb-8 border-b border-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setSelectedTab("rules")}
              className={`pb-4 px-4 font-semibold transition ${
                selectedTab === "rules"
                  ? " border-b-2 border-accent"
                  : "hover:font-semibold"
              }`}
            >
              Rules & Guidelines
            </button>
            <button
              onClick={() => setSelectedTab("prizes")}
              className={`pb-4 px-4 font-semibold transition ${
                selectedTab === "prizes"
                  ? "border-b-2 border-accent"
                  : "hover:font-semibold"
              }`}
            >
              Prizes
            </button>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            className="min-h-96"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {selectedTab === "rules" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Competition Rules</h2>
                <motion.div
                  className="grid md:grid-cols-2 gap-4"
                  initial="hidden"
                  whileInView="visible"
                  transition={{ staggerChildren: 0.1 }}
                  viewport={{ once: true }}
                >
                  {Object.entries(Event.Event.details).map(([key, value]) => (
                    <motion.div
                      key={key}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.6 }}
                      className="flex gap-3 p-4 bg-gray-800 text-gray-200 border-none rounded-lg transition"
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <p>
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {selectedTab === "prizes" && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-6">Prize Pool</h2>
                <motion.div
                  className="grid md:grid-cols-3 gap-6"
                  initial="hidden"
                  whileInView="visible"
                  transition={{ staggerChildren: 0.15 }}
                  viewport={{ once: true }}
                >
                  {Event.Event.prize.map((item, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Card className="p-6 bg-gray-800 text-gray-200 border-none text-center transition">
                        <p className="text-2xl mb-2">{item.place}</p>
                        <p className="text-3xl font-bold mb-2">{item.prize}</p>
                        <p>₹ {item.money}</p>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
