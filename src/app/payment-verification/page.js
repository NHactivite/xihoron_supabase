"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { paymentVerify } from "@/action";
import toast from "react-hot-toast";

const LoaderAnimation = () => (
  <div className="flex flex-col items-center justify-center h-screen space-y-6">
    {/* Animated Loader */}
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ scale: 0.8 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    >
      <div className="w-20 h-20 border-4 border-t-transparent border-amber-400 rounded-full animate-spin"></div>
      <motion.div
        className="absolute w-10 h-10 bg-amber-400/30 rounded-full blur-md"
        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>

    {/* Animated Text */}
    <motion.h1
      className="text-white text-2xl font-semibold tracking-wide text-center"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      Verifying your payment, please don’t close this window...
    </motion.h1>

    {/* Subtext */}
    <motion.p
      className="text-sm text-gray-300 text-center max-w-md"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      Ensuring secure transaction 🔒 — hang tight while we confirm your order.
    </motion.p>
  </div>
);

const VerificationStatus = ({ status }) => {
  if (status === "success")
    return (
      <div className="flex flex-col justify-center items-center h-screen text-green-400">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          ✅ Payment Confirmed!
        </motion.div>
        <p className="text-gray-400 mt-2">Redirecting you shortly...</p>
      </div>
    );

  if (status === "failed")
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-400">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          ❌ Payment Failed
        </motion.div>
        <p className="text-gray-400 mt-2">Redirecting you to your cart...</p>
      </div>
    );

  return <LoaderAnimation />;
};

const PaymentVerificationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("pending");
  const hasFinalized = useRef(false);

  useEffect(() => {
    const order_id = searchParams.get("order_id");

    if (!order_id) {
      toast.error("Invalid payment URL.");
      router.push("/");
      return;
    }

    const tempOrderData = JSON.parse(localStorage.getItem("tempOrderData"));
    if (!tempOrderData) {
      toast.error(
        "Your session has expired. Please check your orders page or contact support if payment was deducted."
      );
      router.push("/");
      return;
    }

    const finalizeOrder = async () => {
      if (hasFinalized.current) return;
      hasFinalized.current = true;
      try {
        const data = await paymentVerify({ order_id, ...tempOrderData });
        console.log(data, "after ");

        if (data && data.success) {
          setStatus("success");
          localStorage.removeItem("tempOrderData");
          setTimeout(() => router.push("/ticket"), 3000);
        } else {
          throw new Error(data?.msg || "Payment verification failed.");
        }
      } catch (error) {
        setStatus("failed");
        setTimeout(() => router.push("/"), 3000);
      }
    };

    finalizeOrder();
  }, [searchParams, router]);

  return <VerificationStatus status={status} />;
};

const PaymentVerificationPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PaymentVerificationContent />
  </Suspense>
);

export default PaymentVerificationPage;
