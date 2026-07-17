"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DeleteCourseDialogProps {
  courseId: string;
  chapterTitle?: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export const DeleteCourseDialog = ({
  courseId,
  chapterTitle,
  trigger,
  onSuccess,
}: DeleteCourseDialogProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    
    try {
      await axios.delete(`/api/courses/${courseId}`);
      
      toast.success("Chapter deleted successfully", {
        position: "top-right",
        duration: 3000,
      });
      
      setIsOpen(false);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/teacher/courses/${courseId}`);
      }
    } catch (error) {
      console.error("[Course_DELETE]", error);
      toast.error("Failed to delete chapter. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Course</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{chapterTitle || "this chapter"}"? 
            This action cannot be undone. All content within this chapter will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Course"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};