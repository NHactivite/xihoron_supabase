"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import UpdateStatus from "../utils/updateStatus";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const OrderMangement = ({ orders }) => {
  const [statusFilter, setStatusFilter] = useState("Processing"); // default

  const filteredOrders = orders.filter((order) => order.status === statusFilter);

  return (
    <Card>
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
            {filteredOrders.map((item,idx) => (
              <div key={idx} className="gap-4 p-4 border rounded-lg">
                <div className="ml-5 mb-5 flex flex-wrap md:flex-row flex-col md:gap-0 gap-2">
                  <span className="font-medium mr-5">
                    Total:{" "}
                    <span className="text-muted-foreground">{item.total}</span>
                  </span>
                  <span className="font-medium mr-5">
                    Total Product:{" "}
                    <span className="text-muted-foreground">
                      {item.orderItems.length}
                    </span>
                  </span>
                  <span className="font-medium mr-5">
                    <UpdateStatus status={item.status} orderId={item._id} />
                  </span>
                  <span className="font-medium mr-5">
                    Delivery Charges:{" "}
                    <span className="text-muted-foreground">
                      {item.shippingCharges}
                    </span>
                  </span>
                  <span className="font-medium mr-5">
                    Order ID:{" "}
                    <span className="text-muted-foreground">
                      {item.orderId}
                    </span>
                  </span>
                </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                  {item.orderItems.map((i, idx) => (
                    <div key={idx} className="col-span-2">
                      <div className="mt-2 flex items-center gap-2">
                        <Image
                          className="rounded-md"
                          src={i.photos}
                          alt="Product image"
                          width={100}
                          height={50}
                          priority
                        />
                        <p className="text-sm text-muted-foreground md:block md:ml-0 md:gap-0 flex flex-col ml-10 gap-2">
                          <span className="font-medium mr-5">
                            Name: <span className="text-muted-foreground">{i.name}</span>
                          </span>
                          <span className="font-medium mr-5">
                            Price: <span className="text-muted-foreground">{i.price}</span>
                          </span>
                          <span className="font-medium mr-5">
                            Quantity: <span className="text-muted-foreground">{i.quantity}</span>
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="ml-5">
                    <p className="flex">
                      <MapPin className="h-5 w-5 mr-1" />
                      Shipping Address
                    </p>
                    <p className="font-medium">{item.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.shippingInfo.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.shippingInfo.city}, {item.shippingInfo.state}{" "}
                      {item.shippingInfo.pinCode} {item.shippingInfo.phnNo}
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

export default OrderMangement;
