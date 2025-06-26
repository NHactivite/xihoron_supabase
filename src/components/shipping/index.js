"use client"
import React from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';

const Shipping = () => {
const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: '',
      city: '',
      state: '',
      country: '',
      pinCode: '',
      phnNo: '',
    },
  });

  return (
    <div>
        <form onSubmit={handleSubmit({})} className='grid grid-cols-1 gap-4 place-items-center mt-8'>
        <h1 className='font-bold text-3xl leading-tight'>Shipping Address</h1>
       <div className='w-2/5 grid gap-4'>
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
            minLength: { value: 10, message: "Phone number must be 10 digits" },
            maxLength: { value: 10, message: "Phone number must be 10 digits" },
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
  )
}

export default Shipping