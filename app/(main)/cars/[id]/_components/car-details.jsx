"use client"
import { toggleSavedCar } from '@/actions/car-listing';
import useFetch from '@/hooks/use-fetch';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, Calendar } from "lucide-react";
import {
  Car,
  Fuel,
  Gauge,
  LocateFixed,
  Share2,
  Heart,
  MessageSquare,
  Currency,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { formatCurrency } from '@/lib/helper';
import EmiCalculator from './emi-calculator';
import { FaCarSide, FaGasPump, FaCogs, FaChair } from "react-icons/fa";
import { format } from 'date-fns';

const CarDetails = ({car,testDriveInfo}) => {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(car.wishlisted);
  
    const {
      loading: savingCar,
      fn: toggleSavedCarFn,
      data: toggleResult,
      error: toggleError,
    } = useFetch(toggleSavedCar);
  
    // Handle toggle result with useEffect
    useEffect(() => {
      if (toggleResult?.success) {
        setIsWishlisted(toggleResult.saved);
        toast.success(toggleResult.message);
      }
    }, [toggleResult]);
  
    // Handle errors with useEffect
    useEffect(() => {
      if (toggleError) {
        toast.error("Failed to update favorites");
      }
    }, [toggleError]);
  
    // Handle save car
    const handleSaveCar = async () => {
        if (!isSignedIn) {
          toast.error("Please sign in to save cars");
          router.push("/sign-in");
          return;
        }
      
        if (savingCar) return;
      
        // Optimistically toggle UI
        setIsWishlisted((prev) => !prev);
      
        const prevWishlisted = isWishlisted;
      
        const result = await toggleSavedCarFn(car.id);
      
        if (result?.success) {
          toast.success(result.message);
        } else {
          // Revert if it failed
          setIsWishlisted(prevWishlisted);
          toast.error("Failed to update favorites");
        }
      };
      


     // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${car.year} ${car.make} ${car.model}`,
          text: `Check out this ${car.year} ${car.make} ${car.model} on Vehiql!`,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("Error sharing", error);
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

 // Handle book test drive
 const handleBookTestDrive = () => {
  if (!isSignedIn) {
    toast.error("Please sign in to book a test drive");
    router.push("/sign-in");
    return;
  }
  router.push(`/test-drive/${car.id}`);
};
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-7/12">
          <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
            {car.images && car.images.length > 0 ? (
              <Image
                src={car.images[currentImageIndex]}
                alt={`${car.year} ${car.make} ${car.model}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Car className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

         {/* Thumbnails */}
         {car.images && car.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {car.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-md h-20 w-24 flex-shrink-0 transition ${
                    index === currentImageIndex
                      ? "border-2 border-gray-600 rounded-md"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${car.year} ${car.make} ${car.model} - view ${
                      index + 1
                    }`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
  {/* Secondary Actions */}
          <div className="flex mt-4 gap-4">
            <Button
              variant="outline"
              className={`flex items-center gap-2 flex-1 ${
                isWishlisted ? "text-red-500" : ""
              }`}
              onClick={handleSaveCar}
              disabled={savingCar}
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`}
              />
              {isWishlisted ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 flex-1"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              Share
            </Button>
          </div>
        </div>

         {/* Car Details */}
        <div className="w-full lg:w-5/12">
          <div className="flex items-center justify-between">
            <Badge className="mb-2">{car.bodyType}</Badge>
          </div>

          <h1 className="text-4xl font-bold mb-1">
            {car.make} {car.model} {car.year} 
          </h1>

          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(car.price)}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <div className="flex items-center gap-2">
              <Gauge className="text-gray-500 h-5 w-5" />
              <span>{car.mileage.toLocaleString()} miles</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="text-gray-500 h-5 w-5" />
              <span>{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="text-gray-500 h-5 w-5" />
              <span>{car.transmission}</span>
            </div>
          </div>

          <Dialog>
            <DialogTrigger className="w-full text-start">
              <Card className="pt-5">
                <CardContent>
                  <div className="flex items-center gap-2 text-lg font-medium mb-2">
                    <Currency className="h-5 w-5 text-blue-600" />
                    <h3>EMI Calculator</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    Estimated Monthly Payment:{" "}
                    <span className="font-bold text-gray-900">
                      {formatCurrency(car.price / 60)}
                    </span>{" "}
                    for 60 months
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    *Based on $0 down payment and 4.5% interest rate
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vehiql Car Loan Calculator</DialogTitle>
                <EmiCalculator price={car.price} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
           {/* Request More Info */}
           <Card className="my-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-lg font-medium mb-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3>Have Questions?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Our representatives are available to answer all your queries
                about this vehicle.
              </p>
              <a href="mailto:help@vehiql.in">
                <Button variant="outline" className="w-full">
                  Request Info
                </Button>
              </a>
            </CardContent>
          </Card>
          {(car.status === "SOLD" || car.status === "UNAVAILABLE") && (
            <Alert variant="destructive">
              <AlertTitle className="capitalize">
                This car is {car.status.toLowerCase()}
              </AlertTitle>
              <AlertDescription>Please check again later.</AlertDescription>
            </Alert>
          )}

           {/* Book Test Drive Button */}
           {car.status !== "SOLD" && car.status !== "UNAVAILABLE" && (
            <Button
              className="w-full py-6 text-lg"
              onClick={handleBookTestDrive}
              disabled={testDriveInfo.userTestDrive}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {testDriveInfo.userTestDrive
                ? `Booked for ${format(
                    new Date(testDriveInfo.userTestDrive.bookingDate),
                    "EEEE, MMMM d, yyyy"
                  )}`
                : "Book Test Drive"}
            </Button>
          )}
          </div>
      </div>

{/* Details & Features Section */}
<div className="mt-12 p-6 bg-white rounded-2xl shadow-md ring-1 ring-gray-200">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    {/* Description */}
    <div>
      <h3 className="text-3xl font-semibold mb-4 text-blue-700">Car Overview</h3>
      <p className="text-gray-600 leading-relaxed whitespace-pre-line ">
        {car.description}
      </p>
    </div>

    {/* Features */}
    <div>
      <h3 className="text-3xl font-semibold mb-4 text-gray-600">Key Features</h3>
      <ul className="space-y-4">
        <li className="flex items-center gap-3">
          <FaCogs className="text-blue-600 text-xl" />
          <span className="text-gray-800">{car.transmission} Transmission</span>
        </li>
        <li className="flex items-center gap-3">
          <FaGasPump className="text-blue-600 text-xl" />
          <span className="text-gray-800">{car.fuelType} Engine</span>
        </li>
        <li className="flex items-center gap-3">
          <FaCarSide className="text-blue-600 text-xl" />
          <span className="text-gray-800">{car.bodyType} Body Style</span>
        </li>
        {car.seats && (
          <li className="flex items-center gap-3">
            <FaChair className="text-blue-600 text-xl" />
            <span className="text-gray-800">{car.seats} Seats</span>
          </li>
        )}
        <li className="flex items-center gap-3">
          <span className="inline-block p-1.5 bg-blue-600 rounded-full"></span>
          <span className="text-gray-800">{car.color} Exterior</span>
        </li>
      </ul>
    </div>
  </div>
</div>

{/* Specifications Section */}
<div className="mt-10 p-6 bg-white rounded-2xl shadow-md ring-1 ring-gray-200">
  <h2 className="text-3xl font-semibold mb-6 text-blue-700">Technical Specifications</h2>
  <div className="bg-gray-50 rounded-xl p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { label: 'Make', value: car.make },
        { label: 'Model', value: car.model },
        { label: 'Year', value: car.year },
        { label: 'Body Type', value: car.bodyType },
        { label: 'Fuel Type', value: car.fuelType },
        { label: 'Transmission', value: car.transmission },
        { label: 'Mileage', value: `${car.mileage.toLocaleString()} miles` },
        { label: 'Color', value: car.color },
        car.seats && { label: 'Seats', value: car.seats },
      ]
        .filter(Boolean)
        .map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b last:border-none"
          >
            <span className="text-gray-500">{item.label}</span>
            <span className="text-gray-800 font-medium">{item.value}</span>
          </div>
        ))}
    </div>
  </div>
</div>

 {/* Dealership Location Section */}
<div className="mt-8 p-6 bg-white rounded-2xl shadow-md ring-1 ring-gray-200">
  <h2 className="text-2xl font-semibold mb-6 text-blue-700">Dealership Location</h2>

  <div className="bg-gray-50 rounded-xl p-6">
    <div className="flex flex-col md:flex-row justify-between gap-8">

      {/* Dealership Name and Address */}
      <div className="flex items-start gap-4">
        <LocateFixed className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Vehiql Motors</h4>
          <p className="text-gray-600">
            {testDriveInfo.dealership?.address || "Not Available"}
          </p>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">Phone:</span> {testDriveInfo.dealership?.phone || "Not Available"}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Email:</span> {testDriveInfo.dealership?.email || "Not Available"}
          </p>
        </div>
      </div>

      {/* Working Hours */}
      <div className="md:w-1/2 lg:w-1/3">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Working Hours</h4>
        <div className="space-y-2 text-sm">
          {testDriveInfo.dealership?.workingHours
            ? testDriveInfo.dealership.workingHours
                .sort((a, b) => {
                  const days = [
                    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
                    "FRIDAY", "SATURDAY", "SUNDAY"
                  ];
                  return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
                })
                .map((day) => (
                  <div
                    key={day.dayOfWeek}
                    className="flex justify-between text-gray-600"
                  >
                    <span>
                      {day.dayOfWeek.charAt(0) + day.dayOfWeek.slice(1).toLowerCase()}
                    </span>
                    <span className={day.isOpen ? "" : "text-red-600"}>
                      {day.isOpen ? `${day.openTime} - ${day.closeTime}` : "Closed"}
                    </span>
                  </div>
                ))
            : [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
              ].map((day, index) => (
                <div key={day} className="flex justify-between text-gray-600">
                  <span>{day}</span>
                  <span className={day.isOpen ? "" : "text-red-600"}>
                    {index < 5
                      ? "9:00 - 18:00"
                      : index === 5
                      ? "10:00 - 16:00"
                      : <span >"Closed"</span>}
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  </div>
</div>

       

    </div>
  )
}

export default CarDetails
