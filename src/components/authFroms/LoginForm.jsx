"use client";

import React, { useState } from "react";
import AuthButton from "../authButton/AuthButton";
import { useRouter } from "next/navigation";
import { signIn } from "@/action/index";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";


export default function LoginForm() {
  const [error, setError] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // build FormData only if the signIn helper expects it (keeps compatibility)
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await signIn(formData);

      if (result?.status === "success") {
        router.push("/");
      } else {
        // try to show meaningful message if available
        setError(result?.message || result?.status || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <motion.form
        onSubmit={handleSubmit(loginSubmit)}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md md:max-w-lg"
        aria-labelledby="login-heading"
      >
        <h2 id="login-heading" className="text-xl font-semibold text-gray-800 text-center">
          Sign in to your account
        </h2>

        <div className="grid gap-4 mt-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              aria-invalid={errors.email ? "true" : "false"}
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
            />
            {errors.email && (
              <p role="alert" className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              aria-invalid={errors.password ? "true" : "false"}
              autoComplete="current-password"
              {...register("password", { required: "Password is required" })}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
            />
            {errors.password && (
              <p role="alert" className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <AuthButton type="login" loading={loading} disabled={loading} />
        </div>

        {error && (
          <p role="status" aria-live="polite" className="text-red-500 mt-4 text-center">
            {error}
          </p>
        )}
      </motion.form>
    </div>
  );
}
