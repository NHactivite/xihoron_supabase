"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, Filter, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchAndFilters({
  categories,
  currentFilters,
  occasion,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Local state for form inputs
  const [search, setSearch] = useState(currentFilters.search);
  const [category, setCategory] = useState(currentFilters.category);
  const [priceRange, setPriceRange] = useState([
    currentFilters.minPrice || 0,
    currentFilters.maxPrice || 5000,
  ]);
  const [occa, setOccasion] = useState(currentFilters.occasion);

  const createURL = (updates) => {
    const params = new URLSearchParams(searchParams);

    // Remove page when filters change
    params.delete("page");

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "" && value !== "0") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    return `?${params.toString()}`;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const url = createURL({ search });
    router.push(url);
  };

  const handleFilterChange = (filterUpdates) => {
    const url = createURL(filterUpdates);
    router.push(url);
  };

  const clearAllFilters = () => {
    setSearch("");
    setCategory("");
    setPriceRange([0, 5000]);
    setOccasion("");
    router.push("/");
  };

  const hasActiveFilters =
    search || category || priceRange[0] > 0 || priceRange[1] < 5000 || occa;

  // Update local state when URL changes
  useEffect(() => {
    setSearch(currentFilters.search);
    setCategory(currentFilters.category);
    setPriceRange([
      currentFilters.minPrice || 0,
      currentFilters.maxPrice || 5000,
    ]);
    setOccasion(currentFilters.occasion);
  }, [currentFilters]);

  return (
    <div className=" relative">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-9"
          />
        </div>
        <Button type="submit">Search</Button>
        <Filter className="w-4 h-4 md:hidden flex mt-2" onClick={() => setIsFiltersOpen(!isFiltersOpen)} />
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="hidden md:flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {isFiltersOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </form>

      {/* Filters Panel */}
      {isFiltersOpen && (
        <Card className="w-56 absolute right-0 mt-5 z-50">
          <CardContent>
            <div>
              {/* Category Filter */}
              <div className="mb-3">
                <Label htmlFor="category" className="mb-3">
                  Category
                </Label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value);
                    handleFilterChange({
                      search,
                      category: value === "all" ? "" : value,
                      minPrice:
                        priceRange[0] > 0
                          ? priceRange[0].toString()
                          : undefined,
                      maxPrice:
                        priceRange[1] < 5000
                          ? priceRange[1].toString()
                          : undefined,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-3">
                <Label htmlFor="category" className="mb-3">
                  occasion
                </Label>
                <Select
                  value={occa}
                  onValueChange={(value) => {
                    setCategory(value);
                    handleFilterChange({
                      search,
                      occa: value === "all" ? "" : value,
                      minPrice:
                        priceRange[0] > 0
                          ? priceRange[0].toString()
                          : undefined,
                      maxPrice:
                        priceRange[1] < 5000
                          ? priceRange[1].toString()
                          : undefined,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {occasion.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <Label>
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Label>
                <div className="px-2 mt-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    onValueCommit={(value) => {
                      handleFilterChange({
                        search,
                        category: category || undefined,
                        minPrice:
                          value[0] > 0 ? value[0].toString() : undefined,
                        maxPrice:
                          value[1] < 5000 ? value[1].toString() : undefined,
                      });
                    }}
                    max={5000}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {search && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              Search: "{search}"
              <button
                onClick={() => {
                  setSearch("");
                  handleFilterChange({ search: "" });
                }}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {category && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              Category: {category}
              <button
                onClick={() => {
                  setCategory("");
                  handleFilterChange({ category: "" });
                }}
                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {(priceRange[0] > 0 || priceRange[1] < 5000) && (
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              Price: ${priceRange[0]} - ${priceRange[1]}
              <button
                onClick={() => {
                  setPriceRange([0, 5000]);
                  handleFilterChange({
                    minPrice: undefined,
                    maxPrice: undefined,
                  });
                }}
                className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {occasion && (
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              occasion:{occasion}
              <button
                onClick={() => {
                  setOccasion("");
                  handleFilterChange({ rating: undefined });
                }}
                className="ml-1 hover:bg-yellow-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
