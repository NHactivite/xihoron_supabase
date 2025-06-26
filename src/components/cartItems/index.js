"use client"
import Link from "next/link";
import { FaTrash } from "react-icons/fa";

const CartItems = ({cartItem,incrementHandler,decrementHandler,removeHandler}) => {

 const {photos,productId,name,price,quantity}=cartItem
  return (
    <div className="flex items-center justify-between mt-4">
       <img className="w-60 rounded-md " src={photos} alt={name} />
       <article >
        <Link className="mx-3"  href={`/product/${productId}`}>{name}</Link>
        <span>&#x20B9;{price}</span>
       </article>
       <div className="flex">
        <button className="mx-3" onClick={()=>decrementHandler(cartItem)}>-</button>
        <p className="mx-3">{quantity}</p>
        <button className="mx-3" onClick={()=>incrementHandler(cartItem)}>+</button>
        <button className="mx-3" onClick={()=>removeHandler(productId)} ><FaTrash/></button>
       </div>
   
    </div> 
  )
}

export default CartItems

