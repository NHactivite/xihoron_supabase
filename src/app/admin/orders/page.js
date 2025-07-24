import { getAllOrders } from '@/action'
import OrderMangement from '@/components/admin/order';
import React from 'react'

const AdminOrders = async() => {
   const orders=await getAllOrders();
   console.log(orders,"pooo");
   
  return (
    <OrderMangement orders={JSON.parse(JSON.stringify(orders.data))}/>
  )
}

export default AdminOrders