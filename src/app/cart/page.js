import { getCharges } from '@/action'
import Cart from '@/components/cart'
import { Charge } from '@/model/charge'
import React from 'react'

const CartPage = async() => {
//     const chargesData=await getCharges()
// const createCharge = async () => {
//   const newCharge = await Charge.create({});
//   console.log("Charge created:", newCharge);
// };

// createCharge();

  return (
    <div><Cart charges={chargesData}/></div>
  )
}

export default CartPage