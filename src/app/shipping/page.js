import { getSingleOrder } from '@/action';
import Orders from '@/components/orders';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const Shipped = async() => {
    const user=await currentUser();
    const orderData=await getSingleOrder(user.id);
    const newOrder=JSON.parse(JSON.stringify(orderData))
  return (
    <div>{orderData?<Orders order={newOrder.data}/>:<h1>No order</h1>}</div>
  )
}

export default Shipped