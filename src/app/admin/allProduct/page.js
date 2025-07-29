import { getSearchProducts } from '@/action';
import AllProduct from '@/components/admin/allProduct';
import Pagination from '@/components/pagination';

const AdminProduct = async({ searchParams }) => {
    const currentFilters = {
    search: searchParams.search || "",
    category: searchParams.category || "",
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sort: searchParams.sort || "", // if you are sorting
    page: searchParams.page ? Number(searchParams.page) : 1,
  };
  
  const data=await getSearchProducts(currentFilters);
  const searchProducts=data.products;
  
  return (
     <div >
     
      <main className="flexgap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth md:p-4 p-0 scrollbar-hide min-h-screen">
        <AllProduct products={JSON.parse(JSON.stringify(searchProducts))}/>
       
      </main>
      <Pagination totalPage={data.totalPage}/>
    </div>
  )
}

export default AdminProduct