"use client"
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";

const Orders = ({ order }) => {
  console.log(order,"ooo");
     const [statusFilter, setStatusFilter] = useState("Processing"); // default
   
    const filteredOrders = order.filter((order) => order.status === statusFilter);
   
  return (
        <Card >
  <CardHeader>
    <CardTitle className="ml-3 font-bold text-2xl">Orders</CardTitle>
  </CardHeader>

  <CardContent>
      <RadioGroup
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
          className="flex mb-5 justify-end space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Processing" id="processing" />
            <Label htmlFor="processing">Processing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Shipped" id="shipped" />
            <Label htmlFor="shipped">Shipped</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Delivered" id="delivered" />
            <Label htmlFor="delivered">Delivered</Label>
          </div>
        </RadioGroup>

        {filteredOrders.length === 0 ? (
          <p className="text-center text-muted-foreground">No orders found for "{statusFilter}"</p>
        ) : (
            
           <div className="space-y-4">
      {order.map((item,idx) => (
        
        <div key={item.id} className=" p-4 border rounded-lg">
          {/* Order Summary */}
          
          <div className="mb-5 flex flex-wrap  text-sm ">
            <p className="absolute right-80 font-bold ">{++idx}</p>
            <span className="font-medium mr-5">
              Total: <span className="text-muted-foreground">{item.total}</span>
            </span>
            <span className="font-medium mr-5">
              Total Product: <span className="text-muted-foreground">{item.orderItems.length}</span>
            </span>
            <span className="font-medium mr-5">
              Status: <span className="text-green-500">{item.status}</span>
            </span>
            <span className="font-medium mr-5">
              Delivery Charges: <span className="text-muted-foreground">{item.shippingCharges}</span>
            </span>
            
              <span>order: {new Date(item.createdAt).toLocaleDateString()}</span>
            
          </div>

          {/* Order Items and Address */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {/* Order Items */}
            <div className="col-span-2 space-y-4">
              {item.orderItems.map((i, idx) => (
                <div key={idx} className="flex sm:flex-row items-center gap-20 ">
                  <Image
                    className="rounded-md"
                    src={i.photos}
                    alt="Product Image"
                    width={100}
                    height={60}
                    priority
                  />
                  <p className="text-sm text-muted-foreground leading-5">
                    <span className="block sm:inline font-medium mr-3">
                      Name: <span className="text-muted-foreground">{i.name}</span>
                    </span>
                    <span className="block sm:inline font-medium mr-3">
                      Price: <span className="text-muted-foreground">{i.price}</span>
                    </span>
                    <span className="block sm:inline font-medium mr-3">
                      Quantity: <span className="text-muted-foreground">{i.quantity}</span>
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="p-3 rounded-md bg-gray-50 border">
              <p className="flex items-center font-medium mb-1">
                <MapPin className="h-4 w-4 mr-1" />
                Shipping Address
              </p>
              <p className="font-medium">{item.userName}</p>
              <p className="text-sm text-muted-foreground">
                {item.shippingInfo.address}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.shippingInfo.city}, {item.shippingInfo.state}{" "}
                {item.shippingInfo.pinCode}, {item.shippingInfo.phnNo}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.shippingInfo.country}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
          )}
  </CardContent>
</Card>
     
  );
};

export default Orders;
