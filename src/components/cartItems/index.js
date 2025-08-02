"use client"
import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";

const CartItems = ({cartItem,incrementHandler,decrementHandler,removeHandler}) => {

 const {photos,productId,name,price,quantity}=cartItem
  return (
    <div className="flex items-center justify-between mt-4">
       <Image className="lg:w-40 rounded-md w-20" src={photos} alt={name} width={80}
                    height={80}/>
       <article >
       <div className=" ml-1 lg:ml-0">
         <Link className="lg:mx-3 mx-1 text-sm"  href={`/product/${productId}`}>{name}</Link>
        <span>&#x20B9;{price}</span>
       </div>
       </article>
       <div className="flex ">
        <button className="lg:mx-3 bg-gray-200 px-3 rounded-sm" onClick={()=>decrementHandler(cartItem)}>-</button>
        <p className="mx-3">{quantity}</p>
        <button className="lg:mx-3 mx-1 bg-gray-200 px-2 rounded-sm" onClick={()=>incrementHandler(cartItem)}>+</button>
        <button className="lg:mx-3 mx-1" onClick={()=>removeHandler(productId)} ><FaTrash/></button>
       </div>
   
    </div> 
  )
}

export default CartItems

