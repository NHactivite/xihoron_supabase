
"use client"

import Image from "next/image"
import Link from "next/link"
import { CiHeart } from "react-icons/ci"
import { useState } from "react"
import { wishHandle } from "@/action"



const ProductCard = ({ id, price, photos, name, userId }) => {
  const [isWished, setIsWished] = useState(false)
  const [loading, setLoading] = useState(false)

  console.log("Rendering ProductCard")

  const handleWishClick = async () => {
    try {
      setLoading(true)
      const result = await wishHandle(id, userId)
      console.log("Wishlist Result:", result)

      if (result.success) setIsWished(true)
    } catch (err) {
      console.error("Error adding to wishlist:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-56 min-w-56 group">
      <div className="relative w-full h-60 overflow-hidden rounded-lg">
        <Image
          src={photos || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover rounded transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 600px) 100vw, 300px"
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
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <CiHeart className={`w-6 h-6 ${isWished ? "text-red-500" : "text-pink-600"} transition-colors`} />
          )}
        </span>
      </div>

      {/* Product Info */}
      <p className="mt-2 font-medium">{name}</p>
      <span className="text-sm text-gray-600">&#x20B9; {price}</span>
    </div>
  )
}

export default ProductCard