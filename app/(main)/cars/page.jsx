import { getCarFilters } from "@/actions/car-listing";
import CarFilters from "./_components/car-filters";
import { CarListings } from "./_components/car-listing";


export const metadata = {
  title: "Cars | Vehiql",
  description: "Browse and search for your dream car",
};

export default async function CarsPage() {
  // Fetch filters data on the server
  const filtersData = await getCarFilters();

  return (
    <div className="container mx-auto px-4 ">
      <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
        Browse Cars
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* Filters Section */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <CarFilters filters={filtersData.data} />
        </div>

        {/* Car Listings */}
        <div className="flex-1">
          <CarListings />
        </div>
      </div>
    </div>
  );
}
