"use client";
import { useEffect, useState } from "react";
import { getReview } from "@/action";
import Rating from "../rating";
import { FaTrash } from "react-icons/fa";

const ReviewCard = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await getReview(productId);
      setReviews(res);
    };
    fetchReviews();
  }, [productId]);
  
  return (
    <div className='flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pt-4 scrollbar-hide md:min-h-36 ml-3'>
      {reviews.map((review) => (
        <div key={review._id} className="md:min-w-96 min-w-52 relative bg-gray-100 rounded-md p-3" >
          <p className="text-xl">{review.comment}</p>
          <div className="mt-2"><Rating  value={review.rating}/></div>
          <button className="absolute -top-2 -right-2 bg-gray-900 p-2 rounded-full text-white text-sm"><FaTrash/></button>
        </div>
        
      ))}
    </div>
  );
};

export default ReviewCard;
