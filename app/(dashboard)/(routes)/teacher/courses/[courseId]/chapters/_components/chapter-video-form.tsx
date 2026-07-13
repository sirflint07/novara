"use client";

import { useState, useEffect } from "react";
import { UploadFile } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { X, Edit2, Loader2, Video, Upload } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import MuxPlayerWrapper from "@/components/mux-player-wrapper";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: { playbackId: string | null } | null };
  chapterId: string;
  courseId: string;
}

const ChapterVideoForm = ({ 
  initialData, 
  chapterId, 
  courseId 
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [playbackId, setPlaybackId] = useState<string | null>(
    initialData?.muxData?.playbackId || null
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(
    initialData?.videoUrl || null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("InitialData changed:", initialData);
    if (initialData?.muxData?.playbackId) {
      setPlaybackId(initialData.muxData.playbackId);
    }
    if (initialData?.videoUrl) {
      setVideoUrl(initialData.videoUrl);
    }
  }, [initialData]);

  const handleFileUpload = async (files: { url: string; fileName: string }[]) => {
    const video = files?.[0];
    
    if (!video) {
      toast.error("No video uploaded");
      return;
    }

    setIsUploading(true);
    setIsProcessing(true);
    
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        { 
          videoUrl: video.url,
        }
      );
      
      console.log("Upload response:", response.data);
      
      if (response.data.muxData?.playbackId) {
        setPlaybackId(response.data.muxData.playbackId);
      }
      if (response.data.videoUrl) {
        setVideoUrl(response.data.videoUrl);
      }
      
      setIsEditing(false);
      
      router.refresh();
      
      toast.success("Video uploaded successfully", {
        position: "top-right",
        duration: 3000,
      });
      
      setTimeout(() => {
        setIsProcessing(false);
      }, 5000);
      
    } catch (error) {
      console.error("[VIDEO_UPLOAD]", error);
      toast.error("Failed to upload video", {
        position: "top-center",
      });
      setIsProcessing(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm md:text-base font-semibold text-gray-700">
            Chapter Video
          </p>
          <p className="text-xs text-gray-400">
            {playbackId ? "Video uploaded" : "No video added yet"}
          </p>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            {playbackId ? (
              <>
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                Edit Video
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5 mr-1" />
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
                    onChange={handleFileUpload}
                    endpoint="chapterVideo"
                  />
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    Upload a video file (max 1GB)
                  </p>
                  <p className="text-gray-400 text-xs mt-1 text-center">
                    Supported formats: MP4, MOV, AVI, WebM
                  </p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isUploading}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
            {playbackId ? (
              <MuxPlayerWrapper 
                playbackId={playbackId}
                className="w-full h-full bg-accent text-slate-50"
                
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Video className="h-12 w-12 mb-2" />
                <p className="text-sm">No video available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterVideoForm;