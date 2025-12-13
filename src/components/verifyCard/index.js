"use client";

import { verifyCandidateById } from "@/action";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

const VerifyCard = () => {
  const [res, setRes] = useState(null);
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(false);
  const [openScanner, setOpenScanner] = useState(false);

  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const verifiedRef = useRef(false); // 🔒 prevents multiple calls

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { candidate_Id: "" },
  });

  // ===================== VERIFY HANDLER =====================
  const handleVerify = async ({ candidate_Id }) => {
    if (loading) return; // 🛑 prevent double submit

    setLoading(true);
    try {
      const result = await verifyCandidateById(candidate_Id);
      setRes(result);

      if (!result?.success) {
        toast.error("Invalid ticket");
      }
    } catch (error) {
      toast.error("Error verifying candidate");
    } finally {
      setLoading(false);
      setOpenScanner(false);
      reset();
    }
  };

  // ===================== QR SCANNER EFFECT =====================
  useEffect(() => {
    if (!openScanner || !videoRef.current) return;

    verifiedRef.current = false; // reset lock on open

    scannerRef.current = new QrScanner(
      videoRef.current,
      async (result) => {
        if (!result?.data) return;
        if (verifiedRef.current) return; // 🛑 stop repeats

        verifiedRef.current = true;

        const scannedId = result.data;
        setQrData(scannedId);

        await handleVerify({ candidate_Id: scannedId });

        scannerRef.current?.stop(); // 🛑 stop camera
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scannerRef.current.start();

    return () => {
      scannerRef.current?.stop();
      scannerRef.current = null;
    };
  }, [openScanner]);

  // ===================== UI =====================
  return (
    <div className="w-full">
      {/* ================= FORM ================= */}
      <motion.form
        onSubmit={handleSubmit(handleVerify)}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex lg:flex-row flex-col justify-center px-4 lg:gap-8 gap-5 py-8 rounded-2xl w-full"
      >
        <motion.h1
          className="font-extrabold text-xl lg:block hidden text-center text-indigo-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Verify Candidate
        </motion.h1>

        <Input
          type="text"
          placeholder="Ticket ID"
          {...register("candidate_Id", {
            required: "Candidate ID is required",
          })}
          className="border-gray-300 rounded-lg lg:w-xl"
        />

        <div className="flex justify-center gap-5">
          <Button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-xl"
          >
            {loading ? "Processing..." : "Verify Now"}
          </Button>

          <Button
            type="button"
            disabled={loading}
            onClick={() => setOpenScanner(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
          >
            Scan QR Code
          </Button>
        </div>
      </motion.form>

      {/* ================= QR MODAL ================= */}
      {openScanner && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-[300px] text-center">
            <h2 className="text-lg font-bold mb-3">Scan Ticket QR</h2>

            <video
              ref={videoRef}
              className="w-full h-64 rounded-xl bg-black object-cover"
            />

            {qrData && (
              <p className="mt-3 text-green-600 font-semibold">
                Scanned Ticket ID: {qrData}
              </p>
            )}

            <Button
              onClick={() => setOpenScanner(false)}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Close Scanner
            </Button>
          </div>
        </div>
      )}

      {/* ================= RESULT ================= */}
      {res?.success && res.verifyData && (
        <section className="mt-6 px-6">
          <div className="bg-white shadow-lg rounded-xl p-6 border">
            <h2 className="text-lg font-bold text-indigo-700 mb-3">
              Candidate Verified ✅
            </h2>
            <p><strong>Name:</strong> {res.verifyData.details?.name}</p>
            <p><strong>Email:</strong> {res.verifyData.details?.emailId}</p>
            <p><strong>Phone:</strong> {res.verifyData.details?.phoNo}</p>
            <p><strong>Event:</strong> {res.verifyData.Event?.name}</p>
            <p><strong>Amount:</strong> ₹{res.verifyData.amount}</p>
            <p><strong>User:</strong> {res.verifyData.userName}</p>
            <p><strong>Candidate ID:</strong> {res.verifyData.candidate_Id}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default VerifyCard;
