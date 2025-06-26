import { getProductById } from '@/action';
import ProductSlider from '@/components/product-details'
import { currentUser } from '@clerk/nextjs/server';

const ProductPage = async({params}) => {
  console.log("Rendering ProductPage");
   console.log("Params:", params);
      const user=await currentUser();
      const productId=  params.id
      console.log("Product ID:", productId);
      const data = await getProductById(productId);
      const safeProduct= data? JSON.parse(JSON.stringify(data.product)):null
   console.log("safeee",safeProduct);  
   const safeUser = user ? JSON.parse(JSON.stringify(user)) : null;
      console.log("dataaa",data.product);
      
  return (
    <div ><ProductSlider Product={safeProduct} user={safeUser}/></div>
  )
}

export default ProductPage

