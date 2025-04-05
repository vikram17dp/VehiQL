"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge, Filter, Sliders, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CarFiltersControls } from "./filter-controller";



const CarFilters = ({ filters }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current filter values from searchParams
  const currentMake = searchParams.get("make") || "";
  const currentBodyType = searchParams.get("bodyType") || "";
  const currentFuelType = searchParams.get("fuelType") || "";
  const currentTransmission = searchParams.get("transmission") || "";
  const currentMinPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice"))
    : filters.priceRange.min;
  const currentMaxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice"))
    : filters.priceRange.max;
  const currentSortBy = searchParams.get("sortBy") || "newest";

  // Local state for filters
  const [make, setMake] = useState(currentMake);
  const [bodyType, setBodyType] = useState(currentBodyType);
  const [fuelType, setFuelType] = useState(currentFuelType);
  const [transmission, setTransmission] = useState(currentTransmission);
  const [priceRange, setPriceRange] = useState([
    currentMinPrice,
    currentMaxPrice,
  ]);
  const [sortBy, setSortBy] = useState(currentSortBy);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Update local state when URL parameters change
  useEffect(() => {
    setMake(currentMake);
    setBodyType(currentBodyType);
    setFuelType(currentFuelType);
    setTransmission(currentTransmission);
    setPriceRange([currentMinPrice, currentMaxPrice]);
    setSortBy(currentSortBy);
  }, [
    currentMake,
    currentBodyType,
    currentFuelType,
    currentTransmission,
    currentMinPrice,
    currentMaxPrice,
    currentSortBy,
  ]);
   // Count active filters
   const activeFilterCount = [
    make,
    bodyType,
    fuelType,
    transmission,
    currentMinPrice > filters.priceRange.min ||
      currentMaxPrice < filters.priceRange.max,
  ].filter(Boolean).length;


 // Current filters object for the controls component
 const currentFilters = {
  make,
  bodyType,
  fuelType,
  transmission,
  priceRange,
  priceRangeMin: filters.priceRange.min,
  priceRangeMax: filters.priceRange.max,
};

const handleFilterChange = (filterName,value)=>{
  switch (filterName) {
    case "make":
      setMake(value);
      break;
    case "bodyType":
      setBodyType(value);
      break;
    case "fuelType":
      setFuelType(value);
      break;
    case "transmission":
      setTransmission(value);
      break;
    case "priceRange":
      setPriceRange(value);
      break;
  }
}

const handleClearFilter = (filterName)=>{
  handleFilterChange(filterName,"")
}
const clearFilters = () => {
  setMake("");
  setBodyType("");
  setFuelType("");
  setTransmission("");
  setPriceRange([filters.priceRange.min, filters.priceRange.max]);
  setSortBy("newest");
  const params = new URLSearchParams();
  const search = searchParams.get("search")
  if (search) params.set("search", search);

  const query = params.toString();
  const url = query ? `${pathname}?${query}` : pathname;

  router.push(url);
  setIsSheetOpen(false);
}
const applyFilters = useCallback(() => {
  const params = new URLSearchParams();

  if (make) params.set("make", make);
  if (bodyType) params.set("bodyType", bodyType);
  if (fuelType) params.set("fuelType", fuelType);
  if (transmission) params.set("transmission", transmission);
  if (priceRange[0] > filters.priceRange.min)
    params.set("minPrice", priceRange[0].toString());
  if (priceRange[1] < filters.priceRange.max)
    params.set("maxPrice", priceRange[1].toString());
  if (sortBy !== "newest") params.set("sortBy", sortBy);

  // Preserve search and page params if they exist
  const search = searchParams.get("search");
  const page = searchParams.get("page");
  if (search) params.set("search", search);
  if (page && page !== "1") params.set("page", page);

  const query = params.toString();
  const url = query ? `${pathname}?${query}` : pathname;

  router.push(url);
  setIsSheetOpen(false);
}, [
  make,
  bodyType,
  fuelType,
  transmission,
  priceRange,
  sortBy,
  pathname,
  searchParams,
  filters.priceRange.min,
  filters.priceRange.max,
]);
  return (
    <div className="flex lg:flex-col justify-between gap-4">
      {/* mobile filters */}
      <div className=" lg:hidden mb-4">
        <div className="flex items-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent  side="left"
              className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
                
              </SheetHeader>
              <div className="py-6 ">
                <CarFiltersControls
                    filters={filters}
                    currentFilters={currentFilters}
                    onFilterChange={handleFilterChange}
                    onClearFilter={handleClearFilter}
                />
              </div>
              <SheetFooter>
                  <Button 
                    className='flex-1'
                    type='button'
                    onClick={clearFilters}
                    variant={'outline'}
                  >Reset</Button>
                  <Button
                    type='button'
                    onClick={applyFilters}
                    className={'flex-1'}
                  >
                    Show Results
                  </Button>

              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* sort filters */}

      <Select value={sortBy}
         onValueChange={(value) => {
          setSortBy(value);
          // Apply filters immediately when sort changes
          setTimeout(() => applyFilters(), 0);
        }}
      >
  <SelectTrigger className="w-[180px] lg:w-full">
    <SelectValue placeholder="Sort by" />
  </SelectTrigger>
  <SelectContent>
          {[
            { value: "newest", label: "Newest First" },
            { value: "priceAsc", label: "Price: Low to High" },
            { value: "priceDesc", label: "Price: High to Low" },
          ].map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
</Select>

       {/* Desktop Filters */}
       <div className="hidden lg:block sticky top-24">
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              <Sliders className="mr-2 h-4 w-4" />
              Filters
            </h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-sm text-gray-600"
                onClick={clearFilters}
              >
                <X className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>

          <div className="p-4">
            <CarFiltersControls
              filters={filters}
              currentFilters={currentFilters}
              onFilterChange={handleFilterChange}
              onClearFilter={handleClearFilter}
            />
          </div>

          <div className="px-4 py-4 border-t">
            <Button onClick={applyFilters} className="w-full cursor-pointer">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarFilters;
