"use client";
import { verifyCandidateById } from "@/action";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

const VerifyCard = () => {
  const [res, setRes] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { candidate_Id: "" },
  });

  const handleVerify = async (data) => {
    try {
      const result = await verifyCandidateById(data.candidate_Id);
      setRes(result);
      console.log(result, "verifying");
    } catch (error) {
      toast.error("An error occurred while verifying candidate.");
      console.error("Error in handleVerify:", error);
    }
  };

  return (
    <div>
      <motion.form
        onSubmit={handleSubmit(handleVerify)}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex lg:flex-row flex-col justify-center px-4 lg:gap-8 gap-5 py-8 rounded-2xl w-full"
      >
        <motion.h1
          className="font-extrabold text-xl lg:block hidden text-center text-indigo-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Verify Candidate
        </motion.h1>

        <div>
          <Input
            type="text"
            placeholder="Ticket Id"
            {...register("candidate_Id", { required: "CandidateId is required" })}
            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg lg:w-xl"
          />
          {errors.candidate_Id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.candidate_Id.message}
            </p>
          )}
        </div>

        <motion.div
          className="flex justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-xl shadow-md transition duration-300"
          >
            Verify Now
          </Button>
        </motion.div>
      </motion.form>
      {res?.success && res.verifyData && (
        <section className="mt-6 px-6">
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
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
