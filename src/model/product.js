 import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
    },
    photos: [
      {
        url: String,
        public_id: String,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    occasion: {
      type: String,
      required: true,
    },
    details: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, 
      default: {},
    }
  },
  { timestamps: true }
);

export const Product =mongoose.models.Product || mongoose.model("Product", ProductSchema);
