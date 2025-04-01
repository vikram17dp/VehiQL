"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import useFetch from "@/hooks/use-fetch"
// Import server actions from the correct path
import { AddCar } from "@/actions/cars"
import { useRouter } from "next/navigation"

// Predefined options
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"]
const transmissions = ["Automatic", "Manual", "Semi-Automatic"]
const bodyTypes = ["SUV", "Sedan", "Hatchback", "Convertible", "Coupe", "Wagon", "Pickup"]
const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"]

const AddCarForm = () => {
  const [activeTab, setActiveTab] = useState("ai")
  const [uploadedImages, setUploadedImages] = useState([])
  const [imageError, setImageError] = useState("")
  const router = useRouter();

  const carFormSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "model is required"),
    year: z.string().refine((val) => {
      const year = Number.parseInt(val)
      return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1
    }, "Valid year required"),
    price: z.string().min(1, "Price is required"),
    mileage: z.string().min(1, "Mileage is required"),
    color: z.string().min(1, "Color is required"),
    fuelType: z.string().min(1, "Fuel type is required"),
    transmission: z.string().min(1, "Transmission is required"),
    bodyType: z.string().min(1, "Body type is required"),
    seats: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
    featured: z.boolean().default(false),
    // Images are handled separately
  })

  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      color: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      seats: "",
      description: "",
      status: "AVAILABLE",
      featured: false,
    },
  })

  const { data: addCarResult, loading: addCarLoading, fn: addcarFn } = useFetch(AddCar)

  useEffect(()=>{
    if(addCarResult?.success){
      toast.success("Car added successfully")
      router.push("admin/cars")
    }
  },[addCarResult])
  const onSubmit = async (data) => {
    if (uploadedImages.length === 0) {
      setImageError("Please upload at least one image")
      return
    }
    const carData = {
      ...data,
      year:parseInt(data.year),
      price:parseFloat(data.price),
      mileage:parseInt(data.mileage),
      seats:data.seats ? parseInt(data.seats) : null
    }

    addcarFn({
      carData,
      images: uploadedImages,
    })
  }

  const onMultiImagesDrop = (acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit and will be skipped`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    const newImages = []
    validFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        newImages.push(e.target.result)
        if (newImages.length === validFiles.length) {
          setUploadedImages((prev) => [...prev, ...newImages])
          setImageError("")
          toast.success(`Successfully uploaded ${validFiles.length} image${validFiles.length > 1 ? "s" : ""}`)
        }
      }

      reader.readAsDataURL(file)
    })
  }

  const { getRootProps: getMultiImageRootProps, getInputProps: getMultiImageInputProps } = useDropzone({
    onDrop: onMultiImagesDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  })

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      <Tabs defaultValue="ai" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="ai">AI Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="manual" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Car Details</CardTitle>
              <CardDescription>Enter the details of the car you want to add.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      {...register("make")}
                      placeholder="e.g. Toyota"
                      className={errors.make ? "border-red-500" : ""}
                    />
                    {errors.make && <p className="text-xs text-red-500">{errors.make.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      {...register("model")}
                      placeholder="e.g. Camry"
                      className={errors.model ? "border-red-500" : ""}
                    />
                    {errors.model && <p className="text-xs text-red-500">{errors.model.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      {...register("year")}
                      placeholder="e.g. 2022"
                      className={errors.year ? "border-red-500" : ""}
                    />
                    {errors.year && <p className="text-xs text-red-500">{errors.year.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      {...register("price")}
                      placeholder="e.g. 25000"
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      id="mileage"
                      {...register("mileage")}
                      placeholder="e.g. 15000"
                      className={errors.mileage ? "border-red-500" : ""}
                    />
                    {errors.mileage && <p className="text-xs text-red-500">{errors.mileage.message}</p>}
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      {...register("color")}
                      placeholder="e.g. Blue"
                      className={errors.color ? "border-red-500" : ""}
                    />
                    {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
                  </div>
                  {/* fuel types */}
                  <div className="space-y-2">
                    <Label htmlFor="fueltype">Fuel Type</Label>
                    <Select onValueChange={(value) => setValue("fuelType", value)} defaultValue={getValues("fuelType")}>
                      <SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map((type) => {
                          return (
                            <SelectItem value={type} key={type}>
                              {type}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>

                    {errors.fuelType && <p className="text-xs text-red-500">{errors.fuelType.message}</p>}
                  </div>
                  {/* transmissions */}

                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      onValueChange={(value) => setValue("transmission", value)}
                      defaultValue={getValues("transmission")}
                    >
                      <SelectTrigger className={errors.transmission ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select transmission type" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissions.map((type) => {
                          return (
                            <SelectItem value={type} key={type}>
                              {type}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>

                    {errors.transmission && <p className="text-xs text-red-500">{errors.transmission.message}</p>}
                  </div>
                  {/* body types */}
                  <div className="space-y-2">
                    <Label htmlFor="bodyTypes">Body Type</Label>
                    <Select onValueChange={(value) => setValue("bodyType", value)} defaultValue={getValues("bodyType")}>
                      <SelectTrigger className={errors.bodyType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select body type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyTypes.map((type) => {
                          return (
                            <SelectItem value={type} key={type}>
                              {type}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>

                    {errors.bodyType && <p className="text-xs text-red-500">{errors.bodyType.message}</p>}
                  </div>
                  {/* Seats */}
                  <div className="space-y-2">
                    <Label htmlFor="seats">
                      Number of Seats <span className="text-sm text-gray-500">(Optional)</span>
                    </Label>
                    <Input id="seats" {...register("seats")} placeholder="e.g. 5" />
                  </div>
                  {/* Status */}
                  <div className="space-y-2 mt-1">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(value) => setValue("status", value)} defaultValue={getValues("status")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {carStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Enter detailed description of the car..."
                    className={`min-h-32 ${errors.description ? "border-red-500" : ""}`}
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>
                {/* Featured */}
                <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    id="featured"
                    checked={watch("featured")}
                    onCheckedChange={(checked) => {
                      setValue("featured", checked)
                    }}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="featured">Feature this car</Label>
                    <p className="text-sm text-gray-500">Featured cars appear on the homepage</p>
                  </div>
                </div>
                <div>
                  <div>
                    <Label htmlFor="images" className={imageError ? "text-red-500" : ""}>
                      Image {imageError && <span className="text-red-500">*</span>}
                    </Label>
                    <div
                      {...getMultiImageRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition mt-2 ${
                        imageError ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <input {...getMultiImageInputProps()} />
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400 mb-2" />

                        <span className="text-sm text-gray-600">Drag & drop or click to upload multiple images</span>
                        <span className="text-gray-400 text-xs mt-1">(JPG, PNG, WebP, max 5MB each)</span>
                      </div>
                    </div>
                    {imageError && <p className="text-xs text-red-500 mt-1">{imageError}</p>}
                  </div>
                  {/* Image Previews */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Uploaded Images ({uploadedImages.length})</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Car image ${index + 1}`}
                              height={50}
                              width={50}
                              className="h-28 w-full object-cover rounded-md"
                              priority
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full md:w-auto" disabled={addCarLoading}>
                  {addCarLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Car...
                    </>
                  ) : (
                    "Add Car"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai" className="mt-6">
          {/* AI upload content will go here */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Car Details</CardTitle>
              <CardDescription>Upload a car image and let AI extract the details</CardDescription>
            </CardHeader>
            <CardContent>
              <p>AI upload functionality coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AddCarForm

