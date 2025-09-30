"use client"
import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";

const CartItems = ({cartItem,incrementHandler,decrementHandler,removeHandler}) => {

 const {photos,productId,name,price,quantity,size}=cartItem
  return (
    <div className="flex items-center justify-between mt-4">
       <Image className="lg:w-40 rounded-md w-20" src={photos} alt={name} width={80}
                    height={80}/>
       <article className="flex gap-5 justify-center items-center" >
        <div className="flex flex-col gap-1 lg:flex-row">
           <Link className="lg:mx-3 mx-1 text-sm"  href={`/product/${productId}`}>{name}</Link>
           <span className="text-xs lg:text-sm ml-1 font-bold">size:{size}</span>
        </div>
        <span>&#x20B9;{price}</span>
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

