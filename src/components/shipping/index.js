"use client";
import React, { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { createOrder, createPaymentAction, paymentVerify } from "@/action";
import { load } from "@cashfreepayments/cashfree-js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Shipping = ({user}) => {
  const { cartItems, subtotal } = useSelector(
    (state) => state.cart );
 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      phnNo: "",
    },
  });
const cashfreeRef = useRef(null);
   const router=useRouter()
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        cashfreeRef.current = await load({
          // mode: "sandbox",  //Adjust to "production" for live
          mode: "production", // Adjust to "production" for live
        });
      } catch (error) {
        console.error("Failed to load payment gateway:", error);
      }
    };
    initializeSDK();
  }, []);

   const getSessionId = async (Address) => {
    try {
      const res = await createPaymentAction({
        cartItems: cartItems,
        user:user,
        phnNo:Address.phnNo
      });
      // Check if the response has the necessary data
      if (res && res.payment_session_id) {
        return {
          paymentSessionId: res.payment_session_id,
          orderId: res.order_id,
          orderStatus: res.order_status,
        };
      } else {
        console.error("Missing required session data in response:", res);
        throw new Error("Failed to retrieve valid session data.");
      }
    } catch (error) {
      console.error("Error in getSessionId:", error);
      throw error;
    }
  };

const verifyPayment = async ({ orderId, Address }) => {
  try {
    const data = await paymentVerify(orderId);
    
    if (data && data[0].payment_status === "SUCCESS") {
      
      await createOrder({
        Address,
        cartItems,
        total: data[0].payment_amount,
        subtotal,
        userId: user.userId,
        userName: `${user.firstName} ${user.lastName}`,
        orderId: data[0].order_id,
      });

      toast.success("Payment successful!");
      router.push("/shipping");
    } else {
        toast.error("payment failed")
    }
  } catch (error) {
    
    toast.error("server error payment failed")
  }
};

    const handlePay = async (Address) => {
    try {
      // Check if the cashfreeRef is loaded and the checkout method is available
      if (
        cashfreeRef.current &&
        typeof cashfreeRef.current.checkout === "function"
      ) {
        // Get the payment session ID (this should be returned from your backend or API)
        const sessionId = await getSessionId(Address); // Replace with actual method to fetch the session ID

        // If session ID is invalid or not found, return early
        if (!sessionId) return;

        // Prepare checkout options
        const checkoutOptions = {
          paymentSessionId: sessionId.paymentSessionId,
          redirectTarget: "_modal", // Ensures the payment opens in a modal
        };

        // Initiate the payment flow
        cashfreeRef.current
          .checkout(checkoutOptions)
          .then(() => {
            // After payment is initiated, verify the payment
            verifyPayment({ orderId: sessionId.orderId, Address });
          })
          .catch((error) => {
            console.error("Error during checkout:", error);
          });
      } else {
        console.error("checkout function is not available in the Cashfree SDK");
      }
    } catch (error) {
      console.error("Error in handlePay:", error);
    }
  };


  return (
    <div>
      <form
        onSubmit={handleSubmit(handlePay)}
        className="grid grid-cols-1 gap-4 place-items-center md:mt-8 mt-20"
      >
        <h1 className="font-bold text-3xl leading-tight">Shipping Address</h1>
        <div className="md:w-2/5 grid gap-4">
          <Input
            type="text"
            placeholder="Address"
            {...register("address", { required: "Address is required" })}
          />
          {errors.address && <p>{errors.address.message}</p>}

          <Input
            type="text"
            placeholder="City"
            {...register("city", { required: "City is required" })}
          />
          {errors.city && <p>{errors.city.message}</p>}

          <Input
            type="text"
            placeholder="State"
            {...register("state", { required: "State is required" })}
          />
          {errors.state && <p>{errors.state.message}</p>}

          <Input
            type="text"
            placeholder="Country"
            {...register("country", { required: "Country is required" })}
          />
          {errors.country && <p>{errors.country.message}</p>}

          <Input
            type="number"
            placeholder="Pincode"
            {...register("pinCode", {
              required: "Pincode is required",
              minLength: { value: 6, message: "Pincode must be 6 digits" },
              maxLength: { value: 6, message: "Pincode must be 6 digits" },
            })}
          />
          {errors.pinCode && <p>{errors.pinCode.message}</p>}

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
          />
          {errors.phnNo && <p>{errors.phnNo.message}</p>}
        </div>
        <Button
          type="submit"
          //   disabled={loading || cartItems.length === 0}
          //   className={`${dark ? "payDarkbtn" : "paybtn"}`}
        >
          {/* {loading ? "Processing..." : "Pay Now"} */}
          pay now
        </Button>
      </form>
    </div>
  );
};

export default Shipping;
