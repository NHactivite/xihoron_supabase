"use client";
import { createPaymentAction } from "@/action";
import { load } from "@cashfreepayments/cashfree-js";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Join = ({ Event, user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailId: "",
      name: "",
      phnNo: "",
    },
  });

  const cashfreeRef = useRef(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        cashfreeRef.current = await load({
          mode: "sandbox", // change to "production" for live
        });
      } catch (error) {
        console.error("Failed to load payment gateway:", error);
      }
    };
    initializeSDK();
  }, []);

  const Event_details = {
    name: Event.Event.title,
    Event_id: Event.Event._id,
  };

  const handlePay = async (Details) => {
    try {
      if (!cashfreeRef.current?.checkout) {
        toast.error("Payment Gateway is not ready. Please refresh the page.");
        return;
      }

      localStorage.setItem(
        "tempOrderData",
        JSON.stringify({
          Details,
          Event_details,
          user,
        })
      );

      const res = await createPaymentAction({
        event: Event,
        user,
        phnNo: Details.phnNo,
        Details,
      });

      if (res && res.payment_session_id) {
        const checkoutOptions = {
          paymentSessionId: res.payment_session_id,
          redirectTarget: "_self",
        };

        cashfreeRef.current.checkout(checkoutOptions);
      } else {
        toast.error("Could not create payment session. Please try again.");
        localStorage.removeItem("tempOrderData");
      }
    } catch (error) {
      toast.error("An error occurred while initiating payment.");
      localStorage.removeItem("tempOrderData");
      console.error("Error in handlePay:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-indigo-50 to-blue-100">
      <motion.form
        onSubmit={handleSubmit(handlePay)}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md md:max-w-lg"
      >
        <motion.h1
          className="font-extrabold text-3xl text-center text-indigo-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Joining Form
        </motion.h1>

        <motion.em
          className="block text-sm text-center text-gray-600 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Event.Event.teamSize.teamLeadRequired
            ? `Need info of one Person (leader info)`
            : "Provide Below Details"}
        </motion.em>

        <div className="grid gap-4 mt-6">
          <div>
            <Input
              type="text"
              placeholder="Email ID"
              {...register("emailId", { required: "EmailId is required" })}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
            />
            {errors.emailId && (
              <p className="text-red-500 text-sm mt-1">{errors.emailId.message}</p>
            )}
          </div>

          <div>
            <Input
              type="text"
              placeholder="Full Name"
              {...register("name", { required: "Name is required" })}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Phone Number"
              {...register("phnNo", {
                required: "Phone number is required",
                minLength: {
                  value: 10,
                  message: "Phone number must be 10 digits",
                },
                maxLength: {
                  value: 10,
                  message: "Phone number must be 10 digits",
                },
              })}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
            />
            {errors.phnNo && (
              <p className="text-red-500 text-sm mt-1">{errors.phnNo.message}</p>
            )}
          </div>
        </div>

        <motion.div
          className="flex justify-center mt-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-xl shadow-md transition duration-300"
          >
            Pay Now
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default Join;
