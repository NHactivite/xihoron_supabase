"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const params = useSearchParams();
  const message = params.get("message");

  useEffect(() => {
    if (message === "login-required") {
      toast.error("Please login and register first");
    }
  }, [message]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0b1e3b] via-[#2b0b49] to-[#442b5c]">
      <Toaster position="top-center" />
      <SignIn
        appearance={{
          elements: {
            card: "shadow-lg rounded-2xl bg-white/10 backdrop-blur-md border border-white/20",
          },
          layout: {
            logoPlacement: "inside",
          },
        }}
      />
    </div>
  );
}
