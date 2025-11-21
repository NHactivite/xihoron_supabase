// "use client";

// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from "next/link";

// export default function TicketCardClient({ candidate }) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0b1e3b] via-[#2b0b49] to-[#ff6a3d] p-8">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {candidate?.Candidate?.map((i, idx) => (
//           <motion.div
//             key={idx}
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: idx * 0.15, duration: 0.6 }}
//           >
//             <Card className="bg-gray-100/90 backdrop-blur-md shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-none rounded-2xl">
//               <CardHeader>
//                 <CardTitle className="text-lg font-semibold text-[#1a1a1a]">
//                   {i.Event.name}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-700 mb-1">
//                   Ticket ID:{" "}
//                   <span className="font-semibold">{i.candidate_Id}</span>
//                 </p>
//                 <p className="text-gray-700 mb-1">
//                   Name: <span className="font-semibold">{i.details.name}</span>
//                 </p>
//                 <p className="text-gray-700 mb-3">
//                   Email: <span className="font-semibold">{i.details.emailId}</span>
//                 </p>

//                 <Link
//                   href={`/events/${i.Event.id}`}
//                   className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-md font-medium hover:opacity-90 transition"
//                 >
//                   Explore Now
//                 </Link>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function TicketCardClient({ candidate }) {
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState("");

  const openQR = (candidateId) => {
    setQrValue(candidateId);
    setShowQR(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1e3b] via-[#2b0b49] to-[#ff6a3d] p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidate?.Candidate?.map((i, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
          >
            <Card className="bg-gray-100/90 backdrop-blur-md shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-none rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#1a1a1a]">
                  {i.Event.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-1">
                  Ticket ID:{" "}
                  <span className="font-semibold">{i.candidate_Id}</span>
                </p>
                <p className="text-gray-700 mb-1">
                  Name: <span className="font-semibold">{i.details.name}</span>
                </p>
                <p className="text-gray-700 mb-3">
                  Email: <span className="font-semibold">{i.details.emailId}</span>
                </p>

                <div className="flex  items-center gap-5">
                  {/* Explore Button */}
                <Link
                  href={`/events/${i.Event.id}`}
                  className=" px-4 py-2 bg-gradient-to-r   from-pink-600 to-purple-600 text-white  rounded-md font-medium hover:opacity-90 transition"
                >
                  Explore Now
                </Link>

                {/* QR Button */}
                <button
                  onClick={() => openQR(i.candidate_Id)}
                  className="bg-gradient-to-r   from-pink-700 to-purple-600 text-white px-4 py-2 rounded-md font-mediumtransition"
                >
                  QR Code
                </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* QR MODAL */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-[300px] text-center flex flex-col justify-center items-center">
            <h2 className="text-lg font-bold mb-4">Only Admin Can verify</h2>

            <QRCodeCanvas value={qrValue} size={200} level="H" includeMargin={true} />

            <p className="mt-3 text-sm text-gray-600">
              Ticket ID: <span className="font-semibold">{qrValue}</span>
            </p>

            <button
              onClick={() => setShowQR(false)}
              className="mt-5 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
