import { getAllProduct, getLatestProducts, getTopSellingProducts } from '@/action';
import Home from '@/components/home'
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

 export default async function Page(){
  const res = await getAllProduct();
  const user = await currentUser();
  const latestProducts=await getLatestProducts()
  const topSell=await getTopSellingProducts()
 
  return (
   <Home topSell={topSell} latestProducts={latestProducts} Products={res} user={JSON.parse(JSON.stringify(user))}/>
  )
}
