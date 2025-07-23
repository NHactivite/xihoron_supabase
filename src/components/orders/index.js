import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";

const Orders = ({ order }) => {
 
  return (
      <Card>
        <CardHeader>
          <CardTitle className="ml-3 font-bold text-2xl">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.map((item) => (
              <div
                key={item.id}
                className="gap-4 p-4 border rounded-lg"
              >
               <div className="ml-5 mb-5">
                        <span className="font-medium mr-5">Total: <span className="text-muted-foreground">{item.total}</span></span>
                        <span className="font-medium mr-5">Total Product: <span className="text-muted-foreground">{item.orderItems.length}</span></span>
                        <span className="font-medium mr-5">Status: <span className="text-green-500">{item.status}</span></span>
                        <span className="font-medium mr-5">Deliver Charges: <span className="text-muted-foreground">{item.shippingCharges}</span></span>
                </div>
               <div className="grid grid-cols-3 items-center ">
                 {item.orderItems.map((i, idx) => (
                  <div key={idx} className="col-span-2">
                    
                        <div className="mt-2 flex items-center gap-2">
                          <Image
                          className="rounded-md"
                            src={i.photos} // or a remote URL if configured
                            alt="Description of the image"
                            width={100} // Required
                            height={50} // Required
                            priority // Optional: preload the image
                          />
                          <p className="text-sm text-muted-foreground">
                        <span className="font-medium mr-5"> Name:  <span className="text-muted-foreground">   {i.name} </span></span>
                        <span className="font-medium mr-5">Price: <span className="text-muted-foreground"> {i.price}</span></span>
                        <span className="font-medium mr-5">Quantity: <span className="text-muted-foreground"> {i.quantity}</span></span>
                          </p>
                        </div>
                  </div>
                ))}
                <div className="ml-5">
                     <p className="flex"> 
                        <MapPin className="h-5 w-5" />
                      Shipping Address
                      </p>
                      <p className="font-medium">{item.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.shippingInfo.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.shippingInfo.city}, {item.shippingInfo.state}{" "}
                        {item.shippingInfo.pinCode}{" "}
                        {item.shippingInfo.phnNo}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.shippingInfo.country}
                      </p>
                   
                 </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    
  );
};

export default Orders;
