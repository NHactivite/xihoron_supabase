"use client"
import CartItems from "../cartItems";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, calculatePrice, removeCartItem } from "@/redux/reducer/cartReducer";
import Link from "next/link";
import { useEffect } from "react";

const Cart = () => {

  const dispatch=useDispatch()

  const {cartItems,subtotal,shippingCharges,total,discount}=useSelector((state)=>state.cartReducer)
 
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
      dispatch(calculatePrice())
  },[cartItems])


  return (
    <div className="h-lvh">
      <main className="min-h-3/4">
        {
         cartItems.length >0 ? ( cartItems.map((i,idx)=>(
          <CartItems key={idx} cartItem={i} incrementHandler={incrementHandler} decrementHandler={decrementHandler} removeHandler={removeHandler}/>
        ))) :(<h1>No Items Add</h1>)
        }
      </main>
      <aside className=" flex flex-col justify-center items-center gap-3" >
        <div className="flex gap-10 ">
        <p>Subtotal: &#x20B9;{subtotal}</p>
        <p>Shipping Charges: &#x20B9;{shippingCharges}</p>
        <p>
          <b>Total :&#x20B9; {total}</b>
        </p>
        </div>    

          {
            cartItems.length>0 && <Link href={"/shipping"}>Checkout</Link>
          }
      </aside>
    </div>
  );
};

export default Cart;
