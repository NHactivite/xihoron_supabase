// components/WishCard.tsx
import { getProductById, deleteWish } from '@/action';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import DeleteItem from '../deleteItem';
 // client component using form

const WishCard = async ({ productId }) => {
  const res = await getProductById(productId);

  if (!res?.product) return <div>Product not found</div>;

  const product = res.product;

  return (
   <div className="border rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white p-4 flex flex-col items-center relative w-full max-w-xs ">
  <Image
    src={product.photos[0].url}
    alt={product.name}
    width={80}
    height={180}
    className="rounded-md object-cover"
  />
  
  <div className="flex flex-col items-center gap-2 mt-4 text-center">
    <p className="font-semibold text-lg text-gray-800">{product.name}</p>
    <p className="text-sm text-gray-600">&#x20B9; {product.price}</p>
    <Link href={`/product/${product._id}`} passHref>
      <Button className="mt-2 px-4 py-2 text-sm bg-black text-white rounded-lg">
        View Product
      </Button>
    </Link>
  </div>

  <div className="absolute top-2 right-2">
    <DeleteItem productId={productId} />
  </div>
</div>

  );
};

export default WishCard;
