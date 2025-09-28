import mongoose from "mongoose";

const Reviewschema=new mongoose.Schema({
        comment:{
            type:String,
            maxlength:[300,"Comment must not be more than 200 characters"]
        },
        rating:{
            type:Number,
            required:[true,"Please give Rating"]
        },
        user:{
            type:String,
            required:true
        },
        product:{
            type:String,
            required:true
        }
},{
    timestamps:true
})
Reviewschema.index({ product: 1 }); // fast lookups for all reviews of a product
Reviewschema.index({ user: 1, product: 1 }, { unique: true }); 
// ensures 1 user can leave only 1 review per product

export const Review=mongoose.models.Review || mongoose.model("Review",Reviewschema)


