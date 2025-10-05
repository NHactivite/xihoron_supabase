"use client";

import { wishHandle } from "@/action";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { CiHeart } from "react-icons/ci";

const ProductCard = ({ id, price, photos, name, userId }) => {

  const [loading, setLoading] = useState(false);

  const handleWishClick = async () => {
    try {
      setLoading(true);

      const result = userId
        ? await wishHandle(id, userId)
        : toast.error("login first");

      if (result.success) {
        toast.success(result.message)
      };
    } catch (err) {
      console.error("Error adding to wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="ml-3 group max-w-56">
      <div className="relative md:w-[200px] md:h-50 w-[110px] h-[110px]  overflow-hidden rounded-lg group">
        
          <Image
          src={photos || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover rounded transition-transform duration-300 group-hover:scale-105"
        />
       

        {/* Buy Now Button */}
        <Link
          href={`/product/${id}`}
          className="bg-black rounded-md text-white py-1 px-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          Buy Now
        </Link>

        {/* Wishlist Button */}
        <span
          onClick={handleWishClick}
          className=" absolute md:top-3 md:right-3 right-0 top-0 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <CiHeart
              className={`w-6 h-6 ${
                "text-pink-600"
              } transition-colors`}
            />
          )}
        </span>
      </div>

      {/* Product Info */}
    <div className="mr-2">
        <p className="mt-2 font-medium text-gray-950">{name}</p>
      <span className="text-sm text-gray-950">&#x20B9; {price}</span>
    </div>
    </div>
  );
};

export default ProductCard;
