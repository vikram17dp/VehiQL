"use client";
import { Camera, Upload } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const[searchImage,setSearchImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const handleTextSubmit = async(e) => {
    e.preventDefault();
    if(!searchTerm.trim()){
      toast.error("please enter a search term")
      return
    }
    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`)
  };
  const handleImageSearch = async(e) => {
    e.preventDefault();
    if(!searchTerm){
      toast.error("please upload an image first")
      return;
    }
    // here ai logic comes
  };
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if(file){
      if(file.size > 5 * 1024 * 1024){
        toast.error("Image Size must be less than 5MB")
        return;
      }
      setIsUploading(true)
      setSearchImage(file)

      const reader = new FileReader();

      reader.onloadend=()=>{
        setImagePreview(reader.result);
        setIsUploading(false)
        toast.success("Image Uploaded Successfully");
      }
      reader.onerror= ()=>{
        setIsUploading(false)
        toast.error("Failed to read the image")
      }
      reader.readAsDataURL(file)
    }
  };
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
      },
      maxFiles: 1,
    });
  return (
    <div>
      <form onSubmit={handleTextSubmit}>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Enter make,model,or use AI Image Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-12 py-4 w-full rounded-full border-gray-300 bg-white/95 backdrop-blur-sm"
          />
          <div className="absolute right-[100px]">
            <Camera
              size={35}
              onClick={() => setIsImageSearchActive(!isImageSearchActive)}
              className="cursor-pointer rounded-xl p-1.5"
              style={{
                background: isImageSearchActive ? "black" : "",
                color: isImageSearchActive ? "white" : "",
              }}
            />
          </div>
          <Button type="submit" className="absolute right-2 rounded-full">
            Search
          </Button>
        </div>
      </form>
      {isImageSearchActive && (
        <div className="mt-4">
          <form onSubmit={handleImageSearch}>
            <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center">
              {imagePreview ? (
                <div>
                  <img src={imagePreview} alt="Car Preview"
                  className="h-40 object-contain mb-4"
                  />
                  <Button 
                    variant="outline"
                    onClick={()=>{
                      setSearchImage(null);
                      setImagePreview("")
                      toast.info("Image removed")
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                 <div className="flex flex-col items-center">
                 <Upload className="h-12 w-12 text-gray-400 mb-2"/>
                  <p className="text-gray-600 mb-2">
                  {isDragActive && !isDragReject ? "Leave the File here to upload" : "Drag & drop a car Image or click to select"}
                  </p>
                  {isDragReject && (
                    <p className="text-red-500 mb-2">Invalid Image Type</p>
                  )}
                  <p className="text-gray-400 text-sm">
                    Supports:JPG,PNG (max 5MB)
                  </p>
                 </div>
                </div>
              )}
            </div>
            {imagePreview && <Button
              className='w-full mt-2' type="submit"
              disabled={isUploading}
            >
              {isUploading ? "Uploading" :"Search with this image" }</Button>}
          </form>
        </div>
      )}
    </div>
  );
};

export default HomeSearch;
