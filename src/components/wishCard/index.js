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
    <div className="border rounded-md flex flex-col items-center justify-around bg-gray-200 relative">
      <Image src={product.photos[0].url} alt={product.name} width={150} height={150} />
      <div className="flex flex-col items-center gap-3 mt-3">
        <p className="font-semibold">{product.name}</p>
        <p className="text-sm text-gray-600">&#x20B9; {product.price}</p>
        <Button>
          <Link href={`/product/${product._id}`}>View Product</Link>
        </Button>
      </div>
      <DeleteItem productId={productId} />
    </div>
  );
};

export default WishCard;
