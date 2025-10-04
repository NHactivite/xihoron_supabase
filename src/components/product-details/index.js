"use client";

import { useRating } from "6pp";
import { addReview, getReview } from "@/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addToCart } from "@/redux/reducer/cartReducer";
import { SquarePen } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Rating from "../rating";
import ReviewCard from "../reviewCard";
import Link from "next/link";

export default function ProductSlider({ Product, user }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const imageRef = useRef(null);
  const productId = Product._id;
  const { cartItems } = useSelector((state) => state.cart);

  const {
    Ratings: RatingEdit,
    rating,
    setRating,
  } = useRating({
    IconFilled: <FaStar />,
    IconOutline: <FaRegStar />,
    value: 0,
    selectable: true,
    styles: {
      fontSize: "1.5rem",
      color: "coral",
      justifyContent: "flex-start",
    },
  });

  const dispatch = useDispatch();

  const addCartHandler = (cartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  const images = Product.photos?.map((i) => i.url);

  const handleMouseMove = useCallback((e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMagnifierPosition({ x: e.clientX, y: e.clientY });

    const imageX = (x / rect.width) * 100;
    const imageY = (y / rect.height) * 100;

    setImagePosition({ x: imageX, y: imageY });
  }, []);

  const handleMouseEnter = () => setShowMagnifier(true);
  const handleMouseLeave = () => setShowMagnifier(false);

  const fetchReviews = async () => {
    const res = await getReview(productId);
    setReviews(res);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const submitReview = async () => {
    if (!comment || !rating) {
      toast.error("Please fill in all fields");
      return;
    }

    if(comment.length>300){
      toast.error("please add a short review");
      return
    }

    const reviewData = {
      comment: comment.trim(),
      rating: Number(rating),
      product: productId,
      user: user.id,
    };

    const res = await addReview(reviewData);
    if (res.success) {
      toast.success(res.message);
      setReviews((prev) => [...prev, res.review]); // 🆕 Add new review to state
      setComment("");
      setRating(0);
      setOpenDialog(false);
    } else {
      toast.error("Failed to submit review: " + res.message);
    }
  };

  return (
    <div >
      <div className="grid md:grid-cols-[1.5fr_2fr] md:pl-36 mt-10">
        <div className="w-[350px] h-[400px] px-2">
          <div className="relative overflow-hidden rounded-lg border bg-gray-50">
            <div className="aspect-square relative cursor-crosshair">
              <Image
                ref={imageRef}
                src={images[selectedImage] || "/placeholder.svg"}
                alt={`Product image ${selectedImage + 1}`}
                fill
                className="object-cover"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
              {showMagnifier && (
                <div
                  className="fixed pointer-events-none z-50 border-4 border-white shadow-2xl rounded-full overflow-hidden"
                  style={{
                    left: magnifierPosition.x - 100,
                    top: magnifierPosition.y - 100,
                    width: "200px",
                    height: "200px",
                    backgroundImage: `url(${images[selectedImage]})`,
                    backgroundSize: "400%",
                    backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                    backgroundRepeat: "no-repeat",
                    border: "3px solid #000",
                    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex gap-3 justify-center mt-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative overflow-hidden rounded-md border-2 transition-all duration-200 ${
                  selectedImage === index
                    ? "border-black ring-2 ring-black ring-offset-2"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="aspect-square md:w-20 w-15 relative">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="lg:pl-10 pt-5 px-5">
            <div className="lg:mt-0 mt-5 flex  flex-col lg:gap-1 gap-2 lg:items-start items-center">
              <h1 className="text-2xl font-bold leading-tight">
                {Product.name || "Product Name"}
              </h1>
              <p className="font-bold">Price &#x20B9; {Product.price}</p>
              {/* <em className="flex gap-1 items-center mt-0.5">
                <Rating value={Product?.rating || 0} />({Product?.numOfReviews}{" "}
                reviews)
              </em> */}
              <div>
                <Button
                  onClick={() =>
                    user
                      ? addCartHandler({
                          photos: Product.photos[0].url,
                          price: Product.price,
                          productId,
                          quantity: 1,
                          name: Product.name,
                          stock: Product.stock,
                          size:Product.size,
                          shippingCharges:Product.shippingCharge
                        })
                      : toast.error("Please login")
                  }
                  className="lg:my-3 my-0"
                >
                  Add To Cart
                </Button>
                {cartItems.map((i) =>
                  i.productId === Product._id ? (
                    <Link
                      className="bg-gray-900 text-white rounded-md p-2 ml-4"
                      href={"/cart"}
                      key={i.productId}
                    >
                      Buy now
                    </Link>
                  ) : null
                )}
              </div>
              <em className="flex gap-1 items-center mt-0.5">
                <Rating value={Product?.rating || 0} />({Product?.numOfReviews}{" "}
                reviews)
              </em>
               <span className="font-bold">`size:${Product.size}`</span>
               
            </div>
          

          <h1 className="font-bold lg:mt-2 mt-10">Product description</h1>
          <div>
            <p className="max-w-prose text-sm text-justify leading-relaxed">{Product.description}</p>
            <strong >Product Details:</strong>
            {Product.details.map((i,idx)=>(
              <li className="max-w-prose text-sm text-justify leading-relaxed" key={idx}>
                {i}
              </li>
            ))
            }
          </div>
        </div>
      </div>

      {/* Add Review Button */}
      <div
        onClick={() =>
          user ? setOpenDialog(true) : toast.error("Please login")
        }
        className="flex place-content-end mr-3 cursor-pointer mt-3"
      >
        <SquarePen />
      </div>

      {/* Review Dialog */}
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <RatingEdit />
          <Button className="mt-4" onClick={submitReview}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>

      {/* Reviews */}
      {reviews.length > 0 && (
        <main className="mb-10 mt-1">
          <ReviewCard
            productId={Product._id}
            reviews={reviews}
            setReviews={setReviews}
          />
        </main>
      )}
    </div>
  );
}
