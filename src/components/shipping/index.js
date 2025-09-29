"use client";
import React, { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {  createPaymentAction } from "@/action";
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
          mode: "sandbox",  //Adjust to "production" for live
          // mode: "production", // Adjust to "production" for live
        });
      } catch (error) {
        console.error("Failed to load payment gateway:", error);
      }
    };
    initializeSDK();
  }, []);

  //  const getSessionId = async (Address) => {
  //   try {
  //     const res = await createPaymentAction({
  //       cartItems: cartItems,
  //       user:user,
  //       phnNo:Address.phnNo,
  //       Address:Address
  //     });
     
  //   if (res && res.payment_session_id) {
  //     const checkoutOptions = {
  //         paymentSessionId: res.payment_session_id,
  //         redirectTarget: "_modal", // Ensures the payment opens in a modal
  //         platform: "web"
  //       };

  //     cashfreeRef.current
  //         .checkout(checkoutOptions)
  //         .then(async() => {
  //           const data = await paymentVerify({order_id:res.order_id,Address:Address,cartItems:cartItems,subtotal:subtotal,user:user})
  //           toast.success(data.msg)
  //         })
  //         .catch((error) => {
  //           console.error("Error during checkout:", error);
  //         });

  //     } else {
  //       console.error("Missing required session data in response:", res);
  //       throw new Error("Failed to retrieve valid session data.");
  //     }
  //   } catch (error) {
  //     console.error("Error in getSessionId:", error);
  //     throw error;
  //   }
  // };


//   old hanle pay---------------------------------------
  //   const handlePay = async (Address) => {
  //   try {
  //     // Check if the cashfreeRef is loaded and the checkout method is available
  //     if (
  //       cashfreeRef.current &&
  //       typeof cashfreeRef.current.checkout === "function"
  //     ) {
  //       // Get the payment session ID (this should be returned from your backend or API)
  //       await getSessionId(Address); // Replace with actual method to fetch the session ID

  //     } else {
  //       console.error("checkout function is not available in the Cashfree SDK");
  //     }
  //   } catch (error) {
  //     console.error("Error in handlePay:", error);
  //   }
  // };
//  new handle pay-----------------------------------------
// In your Shipping.js component

// This is the function that will be called on form submit

const handlePay = async (Address) => {
  try {
    if (!cashfreeRef.current?.checkout) {
      toast.error("Payment Gateway is not ready. Please refresh the page.");
      return;
    }

    localStorage.setItem("tempOrderData", JSON.stringify({
        Address,
        cartItems,
        subtotal,
        user
    }));

    // Step 2: Create the payment session on the backend.
    const res = await createPaymentAction({
      cartItems,
      user,
      phnNo: Address.phnNo,
      Address,
    });

    // Step 3: Initiate the checkout.
    if (res && res.payment_session_id) {
      const checkoutOptions = {
        paymentSessionId: res.payment_session_id,
        // Use '_self' to allow the page to redirect cleanly.
        redirectTarget: "_self",
      };
      
      // Let Cashfree take over. No .then() block is needed here.
      cashfreeRef.current.checkout(checkoutOptions);
    } else {
      toast.error("Could not create payment session. Please try again.");
      localStorage.removeItem("tempOrderData"); // Clean up on failure
    }
  } catch (error) {
    toast.error("An error occurred while initiating payment.");
    localStorage.removeItem("tempOrderData"); // Clean up on failure
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
        
        >
        
          pay now
        </Button>
      </form>
    </div>
  );
};

export default Shipping;
