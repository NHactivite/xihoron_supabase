import mongoose from "mongoose";

 const orderSchema = new mongoose.Schema(
    {
     shippingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        pinCode:{
            type:Number,
            required:true
        },
        phnNo:{
            type:Number,
            required:true
        },
     },
     userId:{
       type:String,
       required:true
     },
     userName:{
      type:String,
       required:true
     },
    orderId:{
      type:String,
       required:true
    },
     subtotal:{
      type:Number,
      required:true
       },
     shippingCharges:{
      type:Number,
      required:true
       },
     total:{
      type:Number,
      required:true
       },
       status:{
        type:String,
        enum:["Processing","Shipped","Delivered"],
        default:"Processing"
      },
    
      orderItems:[
        {
          name:String,
          photos:String,
          price:Number,
          quantity:Number,
          size:String,
          productId:{
            type:mongoose.Types.ObjectId,
            ref:"Product"
          }

        }
      ]

    },
    {
      timestamps: true,
    }
  );

  // Indexes
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
  
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}
  
export const Order = mongoose.models.Order|| mongoose.model("Order", orderSchema);

