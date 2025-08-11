"use client";
import { deleteReview, getReview } from "@/action";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import Rating from "../rating";
import { useUser } from "@clerk/nextjs";

const ReviewCard = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const user=useUser()

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await getReview(productId);
      setReviews(res);
    };
    fetchReviews();
  }, [productId]);

  const reviewHandler=async(id)=>{
     try {
      const result=await deleteReview(id)
     toast.success( result.message)
    setReviews((prevReviews) => prevReviews.filter((review) => review._id !== id));
     } catch (error) {
      toast.error("not found")
     }
  }
  
  return (
    <div className='flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pt-4 scrollbar-hide md:min-h-36 ml-3'>
      {reviews.map((review) => (
        <div key={review._id} className="md:min-w-96 min-w-52 relative bg-gray-100 rounded-md p-3" >
          <p className="text-xl">{review.comment}</p>
          <div className="mt-2"><Rating  value={review.rating}/></div>
          {review.user===user.user.id?<button className="absolute -top-2 -right-2 bg-gray-900 p-2 rounded-full text-white text-sm" onClick={()=>reviewHandler(review._id)}><FaTrash/></button>:null}
        </div>
        
      ))}
    </div>
  );
};

export default ReviewCard;
