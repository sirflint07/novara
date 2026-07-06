"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Edit2, PlusCircleIcon, Video, X, Loader2 } from "lucide-react";
import { UploadFile } from "@/components/file-upload";
import { Chapter, MuxData } from "@prisma/client";
import z from "zod";

interface ChapterFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1)
})

const ChapterVideoForm = ({ courseId, initialData, chapterId }: ChapterFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(initialData?.videoUrl);
  const router = useRouter();
  

  useEffect(() => {
    setCurrentVideoUrl(initialData?.videoUrl);
  }, [initialData?.videoUrl]);

  const handleChapterEdit = () => {
    setIsEditing((current) => !current);
  };

  const handleFileUpload = async (value: z.infer<typeof formSchema>) => {
    console.log("Received URL from upload:", value.videoUrl);

    if (!value) {
      toast.error("No video URL received");
      return;
    }
    
    setIsUploading(true);
    try {
      console.log("Sending PATCH request to:", `/api/courses/${courseId}/chapters/${chapterId}`);
      const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { videoUrl: value.videoUrl });
      console.log("API response:", response.data);
      
      setCurrentVideoUrl(currentVideoUrl);
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
        <p className="text-sm md:text-base font-semibold text-gray-700">Chapter Video</p>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleChapterEdit}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            disabled={isUploading}
          >
            {currentVideoUrl ? (
              <>
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                Edit Chapter
              </>
            ) : (
              <>
                <PlusCircleIcon className="h-3.5 w-3.5 mr-1" />
                Add Video
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
                  <p className="text-sm text-gray-600">Uploading video...</p>
                </div>
              ) : (
                <>
                  <UploadFile 
                    onChange={(video) => handleFileUpload({ videoUrl: video[0].url })}
                    endpoint="chapterVideo" 
                  />
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    Upload a video (max 512MB). Supported formats: MP4, MOV, AVI.
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
                onClick={handleChapterEdit}
                disabled={isUploading}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {currentVideoUrl ? (
              <div className="relative rounded-lg overflow-hidden bg-gray-100 p-2 flex justify-center items-center aspect-video">
                <video
                  src={`${currentVideoUrl}`}
                  controls
                  width={300}
                  height={200}
                  className="object-contain w-full h-full rounded-lg"
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <Video size={48} className="text-gray-400 mb-3" />
                <p className="text-gray-500 text-sm font-medium">No video uploaded yet</p>
                <p className="text-gray-400 text-xs mt-1">Click "Upload Video" to upload</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterVideoForm;