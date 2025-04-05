import React from "react";

const CarPage = async ({ params }) => {
  const { id } = await params; 
 
  return (
    <div className="bg-red-500 p-4 text-white text-xl">
      CarsPage:{id}
    </div>
  );
};

export default CarPage;
