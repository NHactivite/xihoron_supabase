import { getSingleOrder } from '@/action';
import Orders from '@/components/orders';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const Shipped = async() => {
    const user=await currentUser();
    const orderData=await getSingleOrder(user.id);
    console.log(orderData.data,"orders");
    
  return (
    <div><Orders order={orderData.data}/></div>
  )
}

export default Shipped