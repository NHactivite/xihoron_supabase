"use client";
import React, { useState } from "react";
import AuthButton from "../authButton/AuthButton";
import { useRouter } from "next/navigation";
import {signUp} from "@/action/index";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
const SignUpForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      email:""
    },
  });
  const signupSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData=new FormData(event.currentTarget)
    const result=await signUp(formData)

    if(result.status=="success"){
      router.push("/login")
    }else{
      setError(result.status)
    }

    setLoading(false);
  };
  return (
    <div className="flex flex-col items-center justify-center px-4">
    <motion.form
      onSubmit={handleSubmit(signupSubmit)}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md md:max-w-lg"
      aria-labelledby="login-heading"
    >
       <h2 id="login-heading" className="text-xl font-semibold text-gray-800 text-center">
         Create your account
        </h2>
        <div className="grid gap-4 mt-6">
        <div>
            <Input
              type="username"
              placeholder="username"
              aria-invalid={errors.username ? "true" : "false"}
              {...register("username", {
                required: "username is required" })}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
            />
            {errors.username && (
              <p role="alert" className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
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
          <AuthButton type="Sign up" loading={loading} />
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </motion.form>
    </div>
  );
};

export default SignUpForm;
