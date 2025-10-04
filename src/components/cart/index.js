"use client"
import CartItems from "../cartItems";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, calculatePrice, removeCartItem, setChargesAndLimit } from "@/redux/reducer/cartReducer";
import Link from "next/link";
import { useEffect } from "react";

const  Cart = ({charges}) => {

  const dispatch=useDispatch()

  const {cartItems,subtotal,shippingCharges,total}=useSelector((state)=>state.cart)

 
  const incrementHandler=(cartItem)=>{
  
    if(cartItem.quantity>=cartItem.stock) return;
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity+1}))
 }
  const decrementHandler=(cartItem)=>{
    if(cartItem.quantity<=1) return;
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity-1}))
 }
  const removeHandler=(productId)=>{
    dispatch(removeCartItem(productId))
 }

  useEffect(()=>{
      window.scrollTo(0, 0);
      dispatch(calculatePrice(charges))
  },[cartItems, dispatch])


  return (
    <div className="h-lvh ">
      <main className="min-h-[30rem]">
        {
         cartItems.length >0 ? ( cartItems.map((i,idx)=>(
          <CartItems key={idx} cartItem={i} incrementHandler={incrementHandler} decrementHandler={decrementHandler} removeHandler={removeHandler}/>
        ))) :(<div className=" flex  justify-center"><h1>No Items Add</h1></div>)
        }
      </main>
      <aside className=" flex flex-col justify-center items-center lg:gap-3 gap-4" >
        <div className="flex lg:gap-10 gap-2 mx-0.5">
        <p>Subtotal: &#x20B9;{subtotal}</p>
        <p>Shipping Charges: &#x20B9;{shippingCharges}</p>
        <p>
          <b>Total :&#x20B9; {total}</b>
        </p>
        </div>    

          {
            cartItems.length>0 && <Link className="bg-black text-white px-3 py-2 rounded-md" href={"/order"}>Buy Now</Link>
          }
      </aside>
    </div>
  );
};

export default Cart;
