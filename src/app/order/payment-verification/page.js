// app/payment-verification/page.js

"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentVerify } from "@/action"; // Import your existing action
import toast from "react-hot-toast";

const VerificationStatus = ({ status }) => {
  if (status === 'success') return <div>Order Confirmed! Redirecting you to your orders...</div>;
  if (status === 'failed') return <div>Payment Failed. Redirecting you to your cart...</div>;
  return <div>Verifying your payment, please do not close this window...</div>;
};

const PaymentVerificationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const order_id = searchParams.get("order_id");

    if (!order_id) {
      toast.error("Invalid payment URL.");
      router.push("/");
      return;
    }

    // Retrieve the order data we saved just before payment
    const tempOrderData = JSON.parse(localStorage.getItem("tempOrderData"));
    if (!tempOrderData) {
      toast.error("Your session has expired. Please check your orders page or contact support if payment was deducted.");
      router.push("/cart");
      return;
    }

    const finalizeOrder = async () => {
      try {
        const data = await paymentVerify({ order_id, ...tempOrderData });
         console.log(data,"payment verfying");
         
        if (data && data.success) {
          // toast.success(data.msg);
          setStatus("success");
          localStorage.removeItem("tempOrderData"); // Important: Clean up the temporary data
          setTimeout(() => router.push("/order"), 3000);
        } else {
          throw new Error(data?.msg || "Payment verification failed.");
        }
      } catch (error) {
        setStatus("failed");
        setTimeout(() => router.push("/cart"), 3000);
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
