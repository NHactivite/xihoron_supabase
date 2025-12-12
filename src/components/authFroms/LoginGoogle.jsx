"use client";

import { signInWithGithub } from "@/action/index";
import React, { useTransition } from "react";
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
const LoginGoogle = () => {
  const [isPending, startTransition] = useTransition();

  const handleGithubLogin = () => {
    startTransition(async () => {
      await signInWithGithub('google');
    });
  };
  return (
    <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    onClick={handleGithubLogin}
    className="w-full  gap-4 hover:cursor-pointer mt-2 h-12 bg-blue-600 rounded-md p-4 flex justify-center items-center"
    >
      <FaGoogle className="text-white" />
      <p className="text-white">
        {isPending ? "Redirecting..." : "Login with Google"}
      </p>
    </motion.div>
  );
};

export default LoginGoogle;
