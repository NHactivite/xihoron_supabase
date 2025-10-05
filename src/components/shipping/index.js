"use client";
import { createPaymentAction } from "@/action";
import { load } from "@cashfreepayments/cashfree-js";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Shipping = ({user}) => {
  const { cartItems, subtotal,shippingCharges } = useSelector(
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
      shippingCharges,
      user,
      phnNo: Address.phnNo,
      Address,
    });
  
    // Step 3: Initiate the checkout.
    if (res && res.payment_session_id) {
      const checkoutOptions = {
        paymentSessionId: res.payment_session_id,
        redirectTarget: "_modal", // Ensures the payment opens in a modal
        platform: "web"
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
    <div >
      <form
        onSubmit={handleSubmit(handlePay)}
        className="grid grid-cols-1 gap-4 place-items-center md:mt-8 mt-20"
      >
        <h1 className="font-bold text-3xl leading-tight">Shipping Address</h1>
        <div className="grid gap-4 min-w-80 lg:w-2/5">
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
