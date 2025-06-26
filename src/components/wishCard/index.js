import { getProductById } from '@/action';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';

const WishCard = async ({ productId }) => {
    console.log("idd",productId);
    
  const res = await getProductById(productId);
  console.log("oo",res.product);
  
  if (!res.product) return <div>Product not found</div>;

  return (
    <div className=" border rounded-md flex flex-col items-center justify-around bg-gray-200">
      <Image src={res.product.photos[0].url} alt={res.product.name} width={200} height={200} />
      <div className='flex flex-col items-center gap-3 mt-3'>
        <p className="font-semibold">{res.product.name}</p>
      <p className="text-sm text-gray-600">&#x20B9; {res.product.price}</p>
      <Button><Link href={`/product/${res.product._id}`} >
        View Product
      </Link></Button>
      </div>
    </div>
  );
};

export default WishCard;
