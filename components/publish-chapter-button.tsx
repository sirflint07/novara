"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

interface PublishChapterButtonProps {
  courseId: string;
  isPublished: boolean;
  disabled?: boolean;
}

export const PublishChapterButton = ({
  courseId,
  isPublished,
  disabled = false,
}: PublishChapterButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/unpublish`
        );
        toast.success("Chapter unpublished successfully", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        await axios.patch(
          `/api/courses/${courseId}/publish`
        );
        toast.success("Chapter published successfully", {
          position: "top-right",
          duration: 3000,
        });
      }
      router.refresh();
    } catch (error) {
      console.error("[CHAPTER_PUBLISH]", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
      console.log('Published button changed status to ', isPublished)
    }
  };

  return (
    <Button
      onClick={handlePublish}
      disabled={disabled || isLoading}
      variant={isPublished ? "outline" : "default"}
      className={isPublished ? "text-amber-600 border-amber-200 hover:bg-amber-50" : ""}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {isPublished ? "Unpublishing..." : "Publishing..."}
        </>
      ) : isPublished ? (
        <>
          <EyeOff className="h-4 w-4 mr-2" />
          Unpublish
        </>
      ) : (
        <>
          <Eye className="h-4 w-4 mr-2" />
          Publish
        </>
      )}
    </Button>
  );
};