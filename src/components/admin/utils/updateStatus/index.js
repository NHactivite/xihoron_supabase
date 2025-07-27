"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateStatus } from "@/action";
import toast from "react-hot-toast";

const UpdateStatus = ({ status, orderId }) => {
   
  const handleStatusChange = async (newStatus) => {
    try {
       const data=await updateStatus({newStatus,orderId})
       data.success?toast.success(data.message):toast.error(data.message)
      // Optional: add toast or re-fetch orders
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Select onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={status || "Update Status"} />
      </SelectTrigger>
      <SelectContent>
        {status === "Processing" && (
          <SelectItem value="Shipped">Shipped</SelectItem>
        )}
        {status === "Shipped" && (
          <SelectItem value="Delivered">Delivered</SelectItem>
        )}
        {status === "Delivered" && (
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        )}
        {status !== "Processing" && status !== "Shipped" && status !== "Delivered" && (
          <>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  );
};

export default UpdateStatus;
