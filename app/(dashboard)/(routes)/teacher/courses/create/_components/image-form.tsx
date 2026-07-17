"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Edit2, PlusCircleIcon, ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { SingleFileUpload } from "@/components/single-upload";

interface ImageFormProps {
  initialData: {
    imageUrl: string | null;
  };
  courseId: string;
}

const ImageForm = ({ courseId, initialData }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(initialData?.imageUrl);
  const router = useRouter();

  useEffect(() => {
    setCurrentImageUrl(initialData?.imageUrl);
  }, [initialData?.imageUrl]);

  const handleImageEdit = () => {
    setIsEditing((current) => !current);
  };

  const handleFileUpload = async (url: string) => {
    console.log("Received URL from upload:", url);
    
    if (!url) {
      toast.error("No file URL received");
      return;
    }
    
    setIsUploading(true);
    try {
      console.log("Sending PATCH request to:", `/api/courses/${courseId}`);
      const response = await axios.patch(`/api/courses/${courseId}`, { imageUrl: url });
      console.log("API response:", response.data);
      
      setCurrentImageUrl(url);
      setIsEditing(false);
      toast.success("Course image updated successfully", {
        position: "top-right",
        duration: 3000,
      });
      router.refresh();
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to update course image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm md:text-base font-semibold text-gray-700">Course Image</p>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleImageEdit}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            disabled={isUploading}
          >
            {currentImageUrl ? (
              <>
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                Edit Image
              </>
            ) : (
              <>
                <PlusCircleIcon className="h-3.5 w-3.5 mr-1" />
                Add Image
              </>
            )}
          </Button>
        )}
      </div>

      <div>
        {isEditing ? (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
                  <p className="text-sm text-gray-600">Uploading image...</p>
                </div>
              ) : (
                <>
                  <SingleFileUpload 
                    onChange={(url) => handleFileUpload(url)}
                    endpoint="courseImage" 
                  />
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    Upload an image (max 8MB)
                  </p>
                  <p className="text-gray-500 text-xs mt-1 text-center font-semibold">
                    (16:9) aspect ratio recommended for best display
                  </p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImageEdit}
                disabled={isUploading}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {currentImageUrl ? (
              <div className="relative rounded-lg overflow-hidden bg-gray-100 p-2 flex justify-center items-center aspect-video">
                <Image
                  src={currentImageUrl}
                  alt="Course thumbnail"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 30vw"
                  width={300}
                  height={200}
                  style={{ width: "auto", height: "auto" }}
                  className="object-contain w-full h-full rounded-lg"
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <ImageIcon size={48} className="text-gray-400 mb-3" />
                <p className="text-gray-500 text-sm font-medium">No image added yet</p>
                <p className="text-gray-400 text-xs mt-1">Click "Add Image" to upload</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageForm;