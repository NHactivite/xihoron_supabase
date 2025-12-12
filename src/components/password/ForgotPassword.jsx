"use client";
import { forgatPassword } from "@/action/index";
import { motion } from "framer-motion";
import { useState } from "react";
import AuthButton from "../authButton/AuthButton";
const ForgotPassword = () => {
   const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [mail, setMail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formdata=new FormData(event.currentTarget);
    setMail(formdata.get("email"))
    const result=await forgatPassword(formdata);
    if(result?.status==="success"){

      setShowMsg(true)
    }
    setLoading(false);
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className="mx-3 mt-8">
          <input
            type="email"
            placeholder="Email"
            id="Email"
            name="email"
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-300 bg-white text-sm text-gray-900"
          />
          <div className="mt-4">
          <AuthButton type="Forgot Password" loading={loading} />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
      {showMsg?<motion.h1 className="mt-2 font-medium text-green-600" initial={{ opacity: 0, y: -40 } }animate={{ opacity: 1, y: 0 }}> 
      The password reset link has been delivered to your email address <span className="text-red-600">{mail}</span>. Please check your inbox.</motion.h1>:null}
    </div> 
  )
}

export default ForgotPassword


