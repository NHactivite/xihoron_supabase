"use client";

import { getCategory, getOccasion, getSearchProducts } from "@/action";
import SearchAndFilters from "@/components/filter";
import Pagination from "@/components/pagination";
import ProductCard from "@/components/product-card";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Search = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [products, setProducts] = useState([]); // ✅ add this
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const filters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sort: searchParams.get("sort") || "",
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    occasion: searchParams.get("occa") || "",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [catRes, occaRes, productRes] = await Promise.all([
        getCategory(),
        getOccasion(),
        getSearchProducts(filters),
      ]);

      setCategories(catRes?.categories || []);
      setOccasions(occaRes?.occasions || []);
      setProducts(productRes?.products||[]) // ✅ This was missing
      setTotalPage(productRes?.totalPage || 1);
      setLoading(false);
    };

    fetchData();
  }, [searchParams.toString()]);
 

   
  return (
    <div>
      <SearchAndFilters
        categories={categories}
        currentFilters={filters}
        occasion={occasions}
      />

      <main className="grid grid-cols-2 md:grid-cols-5 gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth p-4 scrollbar-hide mt-10">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-60 bg-gray-200 animate-pulse rounded-md" />
          ))
        ) : (
          products.map((product, idx) => (
            <ProductCard
              key={idx}
              id={product._id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              photos={product.photos?.[0]?.url}
              userId={user?.id}
            />
          ))
        )}
      </main>

      {!loading && <Pagination totalPage={totalPage} />}
    </div>
  );
};

export default Search;
