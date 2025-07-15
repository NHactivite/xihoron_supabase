"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

function Pagination({ totalPage }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial page from query if available
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);

  // Update URL with new query params
  const createURL = (updates) => {
    const params = new URLSearchParams(searchParams);

    // Add or update entries
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "" && value !== "0") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    return `?${params.toString()}`;
  };

  const handlePageChange = (next) => {
    let newPage = next ? page + 1 : page - 1;
    if (newPage < 1 || newPage > totalPage) return;

    setPage(newPage);
    const url = createURL({ page: newPage.toString() });
    router.push(url);
  };

  // Keep internal state in sync when the user navigates using browser controls
  useEffect(() => {
    const currentQueryPage = parseInt(searchParams.get("page")) || 1;
    setPage(currentQueryPage);
  }, [searchParams]);

  return (
    <div className='flex justify-center mb-10'>
      {totalPage > 1 && (
        <article>
          <button className='cursor-pointer' onClick={() => handlePageChange(false)} disabled={page <= 1}>
            Previous
          </button>
          <span>{" "}{page} of {totalPage} {" "}</span>
          <button className='cursor-pointer' onClick={() => handlePageChange(true)} disabled={page >= totalPage}>
            Next
          </button>
        </article>
      )}
    </div>
  );
}

export default Pagination;
