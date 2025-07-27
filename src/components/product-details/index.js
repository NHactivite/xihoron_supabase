"use client";

import { useRating } from "6pp";
import { addReview } from "@/action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addToCart } from "@/redux/reducer/cartReducer";
import { useCallback, useRef, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Rating from "../rating";
import ReviewCard from "../reviewCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function ProductSlider({ Product, user }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState("");
  // const [rating, setRating] = useState(0);
  const imageRef = useRef(null);
  const productId = Product._id;
  const router=useRouter()
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
    if (cartItem.stock < 1) return toast.error("out Of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  const images = Product.photos?.map((i) => i.url);

  const handleMouseMove = useCallback((e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate the position for the magnifier (offset to center it on cursor)
    setMagnifierPosition({ x: e.clientX, y: e.clientY });

    // Calculate the exact position on the image for zooming (more precise)
    const imageX = (x / rect.width) * 100;
    const imageY = (y / rect.height) * 100;

    setImagePosition({ x: imageX, y: imageY });
  }, []);

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const submitReview = async () => {
    if (!comment || !rating) {
      toast.error("Please fill in all fields");
      return;
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
      setComment("");
      setRating(0);
      setOpenDialog(false);
      router.refresh()
    } else {
      toast.error("Failed to submit review: " + res.message);
    }
  };


  return (
    <div>
      <div className="grid md:grid-cols-[1.5fr_2fr] md:pl-36">
        <div className="w-[350px] h-[400px] md:ml-0 ml-3">
          {/* Main Image Display */}
          <div className="relative overflow-hidden rounded-lg border bg-gray-50">
            <div className="aspect-square relative cursor-crosshair">
              <img
                ref={imageRef}
                src={images[selectedImage] || "/placeholder.svg"}
                alt={`Product image ${selectedImage + 1}`}
                className="w-full h-full object-cover"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />

              {/* Magnifier Lens */}
              {showMagnifier && (
                <div
                  className="fixed pointer-events-none z-50 border-4 border-white shadow-2xl rounded-full overflow-hidden"
                  style={{
                    left: magnifierPosition.x - 100,
                    top: magnifierPosition.y - 100,
                    width: "200px",
                    height: "200px",
                    backgroundImage: `url(${images[selectedImage]})`,
                    backgroundSize: "400%", // Much higher zoom
                    backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                    backgroundRepeat: "no-repeat",
                    border: "3px solid #000",
                    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                  }}
                />
              )}
            </div>
          </div>

          {/* Thumbnail Images */}
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
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
          
        </div>
        <div className="pl-10 pt-15">
          <div className="space-y-4 ">
            <h1 className="text-2xl font-bold leading-tight">
              {Product.name || "Product Name"}
            </h1>
            <p className="font-bold">Price $ 1244</p>
            <em className="flex gap-1 items-center mt-0.5">
              <Rating value={Product?.rating || 0} />({Product?.numOfReviews}{" "}
              reviews)
            </em>
            <div>
              <Button
                onClick={() =>user?
                  addCartHandler({
                    photos: Product.photos[0].url,
                    price: Product.price,
                    productId,
                    quantity: 1,
                    name: Product.name,
                    stock: Product.stock,
                  }):toast.error("please login")
                }
              >
                Add To Cart
              </Button>
              {/* <Button
                onClick={()=>{user?router.push("/order"):toast.error("please login")}}
                className="ml-10 bg-black rounded-md text-white py-2 px-3"
              >
                Buy Now
              </Button> */}
            </div>
            <h1 className="font-bold">Product description</h1>
          </div>
          <div>
            <p>{Product.description}</p>
            <strong>Product Details:</strong>
            {Object.entries(Product.details).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong>{" "}
                {typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
              </li>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={() => user?setOpenDialog(true):toast.error("please login")} className="m-2 mt-10">Add Review</Button>
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle >Add Review</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></Input>
          <RatingEdit />
          <Button className="mt-4" onClick={submitReview}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>
      {Product.numOfReviews !== 0 && (
        <main className="mb-10">
          <ReviewCard productId={Product._id} />
        </main>
      )}
      {/* <div className="mt-10 ml-2">
        <h1 > Recommended For You</h1>
        <main className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth p-4 scrollbar-hide"></main>
      </div> */}
    </div>
  );
}
