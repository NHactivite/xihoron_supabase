import { getProductById } from '@/action';
import ProductSlider from '@/components/product-details'
import { currentUser } from '@clerk/nextjs/server';

const ProductPage = async({params}) => {
      const user=await currentUser();
      const productId=  params.id
      const data = await getProductById(productId);
      const safeProduct= data? JSON.parse(JSON.stringify(data.product)):null 
   const safeUser = user ? JSON.parse(JSON.stringify(user)) :null;
      
  return (
    <div ><ProductSlider Product={safeProduct} user={safeUser}/></div>
  )
}

export default ProductPage

