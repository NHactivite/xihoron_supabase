"use client"
import Link from "next/link";
import { FaTrash } from "react-icons/fa";

const CartItems = ({cartItem,incrementHandler,decrementHandler,removeHandler}) => {

 const {photos,productId,name,price,quantity}=cartItem
  return (
    <div className="flex items-center justify-between mt-4">
       <img className="lg:w-40 rounded-md w-20" src={photos} alt={name} />
       <article >
        <Link className="mx-3"  href={`/product/${productId}`}>{name}</Link>
        <span>&#x20B9;{price}</span>
       </article>
       <div className="flex ">
        <button className="mx-3 bg-gray-200 px-3 rounded-sm" onClick={()=>decrementHandler(cartItem)}>-</button>
        <p className="mx-3">{quantity}</p>
        <button className="mx-3 bg-gray-200 px-2 rounded-sm" onClick={()=>incrementHandler(cartItem)}>+</button>
        <button className="mx-3" onClick={()=>removeHandler(productId)} ><FaTrash/></button>
       </div>
   
    </div> 
  )
}

export default CartItems

