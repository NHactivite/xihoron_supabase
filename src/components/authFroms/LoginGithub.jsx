"use client";

import { signInWithGithub } from "@/action/index";
import React, { useTransition } from "react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
const LoginGithub = () => {
  const [isPending, startTransition] = useTransition();

  const handleGithubLogin = () => {
    startTransition(async () => {
      await signInWithGithub('github')
    });
  };
  return (
    <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    onClick={handleGithubLogin}
    className="w-full  gap-4 hover:cursor-pointer mt-6 h-12 bg-gray-800 rounded-md p-4 flex justify-center items-center"
    >
      <FaGithub className="text-white" />
      <p className="text-white">
        {isPending ? "Redirecting..." : "Login with Github"}
      </p>
    </motion.div>
  );
};

export default LoginGithub;
