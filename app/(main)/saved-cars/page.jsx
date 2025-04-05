import { getSavedCars } from "@/actions/car-listing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SavedCarsList } from "./_components/saved-cars";

export const metadata = {
  title: "Saved Cars | Vehiql",
  description: "View your saved cars and favorites",
};

export default async function SavedCarsPage() {
  // Check authentication on server
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/saved-cars");
  }

  // Fetch saved cars on the server
  const savedCarsResult = await getSavedCars();

  return (
    <div className="container mx-auto px-4 ">
      <h1 className="sm:text-5xl text-2xl sm:ml-8 font-bold mb-6 bg-gradient-to-r from-red-400 to-pink-600 text-transparent bg-clip-text">Your Saved Cars</h1>
      <SavedCarsList initialData={savedCarsResult} />
    </div>
  );
}