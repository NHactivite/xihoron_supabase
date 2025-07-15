// components/DeleteItem.tsx
"use client";

import React from "react";
import { FaTrash } from "react-icons/fa";
import { deleteWish } from "@/action";
import { useTransition } from "react";
import { toast } from "react-hot-toast";

const DeleteItem = ({ productId }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await deleteWish(productId);
        if (res.success) {
          toast.success(res.message);
          window.location.reload();
        } else {
          toast.error(res.message);
        }
      } catch (err) {
        toast.error(err.message || "Error deleting item");
      }
    });
  };

  return (
    <form action={handleDelete}>
      <button
        type="submit"
        disabled={isPending}
        className="-top-2 -right-1.5 absolute rounded-full cursor-pointer"
      >
        <FaTrash />
      </button>
    </form>
  );
};

export default DeleteItem;
