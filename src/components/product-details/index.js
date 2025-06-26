"use client";

import { addReview } from "@/action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addToCart } from "@/redux/reducer/cartReducer";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ReviewCard from "../reviewCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Rating from "../rating";
import { useRating } from "6pp";
import { FaRegStar, FaStar } from "react-icons/fa";
export default function ProductSlider({ Product, user }) {
  console.log("Rendering ProductSlider");
  console.log("product", Product);
  console.log("user", user.id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState("");
  // const [rating, setRating] = useState(0);
  const imageRef = useRef(null);
  const productId = Product._id;
  console.log("ProductSlider ID", productId);

  const {Ratings:RatingEdit,rating,setRating}=useRating({IconFilled:<FaStar/>,
    IconOutline:<FaRegStar/>,
    value:0,
    selectable:true,
   styles:{fontSize:"1.5rem",color:"coral" ,justifyContent:"flex-start"}
  })

  const dispatch = useDispatch();

  const addCartHandler = (cartItem) => {
    console.log("cart clicking", cartItem);
    if (cartItem.stock < 1) return console.log("out Of Stock");
    dispatch(addToCart(cartItem));
    console.log("Added to Cart");
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
      alert("Please fill in all fields");
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
      alert(res.message);
      setComment("");
      setRating(0);
      setOpenDialog(false);
    } else {
      alert("Failed to submit review: " + res.message);
    }
  };

  

  return (
    <div>
      <div className="grid grid-cols-[1.5fr_2fr] pl-36">
        <div className="w-[350px] h-[400px] p-6">
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
          <div className="flex gap-3 justify-center">
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
                <div className="aspect-square w-20 relative">
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
        <div className="p-10">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold leading-tight">
              {Product.name || "Product Name"}
            </h1>
            <p className="font-bold">Price $ 1244</p>
            <em className="flex gap-1 items-center mt-0.5" >
              <Rating value={Product?.rating ||0} />
              ({Product?.numOfReviews} reviews)
              </em>
            <div>
              <Button
                onClick={() =>
                  addCartHandler({
                    photos: Product.photos[0].url,
                    price: Product.price,
                    productId,
                    quantity: 1,
                    name: Product.name,
                    stock: Product.stock,
                  })
                }
              >
                Add To Cart
              </Button>
              <Link
                href={"/order"}
                className="ml-10 bg-black rounded-md text-white py-2 px-3"
              >
                Buy Now
              </Link>
            </div>
            <h1 className="font-bold">Product description</h1>
          </div>
          {/* <div className="w-2/3 mt-3">
            {Product.description}
            <p className="my-4">Product Details:</p>
            <li>5 Sunflowers</li>
            <li>5 Sunflowers</li>
            <li>5 Sunflowers</li>
            <li>5 Sunflowers</li>
          </div> */}
          <div>
            <p>
              Celebrate love and togetherness with this enchanting bouquet of
              red roses paired with two personalized fridge magnets that say
              Happy Anniversary. The magnets printed with your favourite images
              add a personal touch to this thoughtful gift. Perfect for your
              partner spouse or a special couple this gift beautifully combines
              the timeless elegance of roses with heartfelt personalization. Its
              an unforgettable way to mark the anniversary and create lasting
              memories. </p>
              <strong>Product Details:</strong>
              <li>Red rose: 6</li>
              <li>Filler: White gypsophila murraya leaves</li>
              <li>Fridge magnet: 3.7x3 inch:2</li>
              <li>For personalisation please provide us with two images</li>
              <li>Net Quantity: 1 Bouquet</li>
              <li>Dimensions: 18x10 inch</li>
              <li>Weight: Approx 250 to 500 gms</li>
              <li>Country of Origin: India</li>       
          </div>
        </div>
      </div>
      <Button onClick={() => setOpenDialog(true)}>Add Review</Button>
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
          ></Input>
          <RatingEdit/>
          <Button className="mt-4" onClick={submitReview}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>
      {Product.numOfReviews !== 0 && (
        <main>
          <ReviewCard productId={Product._id} />
        </main>
      )}
      <div className="mt-10">
        <h1>Recommended For You</h1>
        <main className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth p-4 scrollbar-hide"></main>
      </div>
    </div>
  );
}
