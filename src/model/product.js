import mongoose from "mongoose";

 const ProductSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Please enter Name"],
      },
      photos:[{
          public_id:{
            type:String,
            required:[true,"Please enter Public ID"],
          },
          url:{
            type:String,
            required:[true,"please enter URL"]
          }
      }],
    // photo: {
    //     type: String,
    //     required: [true, "Please add photo"],
    //   },
      price: {
        type: Number,
        required: [true, "Please enter price"],
      },
      stock: {
        type: Number,
        required: [true, "Please enter stock"],
      },
      category: {
        type: String,
        required: [true, "Please enter Product Category"],
        trim:true,
      },
      description:{
        type:String,
        required:[true,"Please enter Descrption"]
      },
      rating:{
        type:Number,
        default:0,
        max:[5,"Rating must be less then 5"]
      },
      numOfReviews:{
        type:Number,
        default:0
    },
    occasion:{
        type:String,
        required:[true,"Please enter Brand name"],
      },
    },
    {
      timestamps: true,
    }
  );
  
  
  export const Product =mongoose.models.Product || mongoose.model("Product",ProductSchema);
  