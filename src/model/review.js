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

export const Review=mongoose.models.Review || mongoose.model("Review",Reviewschema)