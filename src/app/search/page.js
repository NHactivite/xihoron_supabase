import { getCategory, getOccasion, getSearchProducts } from "@/action";
import SearchAndFilters from "@/components/filter";
import Pagination from "@/components/pagination";
import ProductCard from "@/components/product-card";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const Search = async ({ searchParams }) => {
 
  const user = await currentUser();

  const categories = await getCategory()
  const occasion=await getOccasion()
  
  const currentFilters = {
  search: searchParams.search || "",
  category: searchParams.category || "",
  minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
  maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
  sort: searchParams.sort || "", // if you are sorting
  page: searchParams.page ? Number(searchParams.page) : 1,
  occasion:searchParams.occa||""
};

const searchProducts=await getSearchProducts(currentFilters)


  return (
    <div >
      <SearchAndFilters
        categories={categories.categories}
        currentFilters={currentFilters}
        occasion={occasion.occasions}
      />
      <main className="grid grid-cols-2 md:grid-cols-5  gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth p-4 scrollbar-hide mt-10">
        {searchProducts.products?.map((i, idx) => (
          <ProductCard
            key={idx}
            id={i._id}
            name={i.name}
            price={i.price}
            stock={i.stock}
            photos={i.photos[0].url}
            userId={user?.id}
          />
        ))}
       
      </main>
      <Pagination totalPage={searchProducts.totalPage}/>
    </div>
  );
};

export default Search;
