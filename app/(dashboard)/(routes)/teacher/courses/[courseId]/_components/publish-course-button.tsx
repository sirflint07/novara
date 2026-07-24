"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/hooks/use-confetti";

interface PublishCourseButtonProps {
  courseId: string;
  isPublished: boolean;
  disabled?: boolean;
  isComplete?: boolean;
}

export const PublishCourseButton = ({
  courseId,
  isPublished,
  disabled,
  isComplete
}: PublishCourseButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const confetti = useConfetti();

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
        confetti.onOpen()
        toast.success("Course published successfully", {
          position: "top-right",
          duration: 3000,
        });
      }
      router.refresh();
    } catch (error: any) {
      console.error("[Course_PUBLISH]", error);
      toast.error(`[${error.message}] - Failed to publish course - Check if all course fields have been completed or at least a published chapter`, {
        position: "top-center",
        duration: 5000
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