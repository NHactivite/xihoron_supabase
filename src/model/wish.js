import mongoose from "mongoose";

const schema=new mongoose.Schema({
        wish:{
            type:Boolean,
        },
        user:{
            type:String,
            ref:"User",
            required:true
        },
        Product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        }
},{
    timestamps:true
})

schema.index({ user: 1, Product: 1 }, { unique: true }); // one wishlist entry per user per product
schema.index({ Product: 1 }); // optional, if you query by product for analytics


export const Wish=mongoose.models.Wish || mongoose.model("Wish",schema)