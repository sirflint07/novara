"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit2, PlusCircleIcon, FileIcon, X, Loader2, Trash2 } from "lucide-react";
import { UploadFile } from "@/components/file-upload";
import { Attachment, Course } from "@prisma/client";
import * as z from "zod";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] }
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1, { message: "URL is required" })
})

const AttachmentForm = ({ courseId, initialData }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  const handleFileUpload = async (url: z.infer<typeof formSchema>["url"], fileName: string) => {
    console.log("Received URL from upload:", url);
    console.log("Original file name:", fileName);
    
    if (!url) {
      toast.error("No file URL received");
      return;
    }
    
    setIsUploading(true);
    try {
      console.log("Sending POST request to:", `/api/courses/${courseId}/attachments`);
      const response = await axios.post(`/api/courses/${courseId}/attachments`, { url, filename: fileName });
      console.log("API response:", response.data);
      
      toggleEdit();
      router.refresh();
      toast.success("Attachment added successfully", {
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to add attachment");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    setDeletingId(attachmentId);
    try {
      await axios.delete(`/api/courses/${courseId}/attachments/${attachmentId}`);
      router.refresh();
      toast.success("Attachment deleted successfully", {
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete attachment");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm md:text-base font-semibold text-gray-700">Course Attachments</p>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleEdit}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            {initialData.attachments.length > 0 ? (
              <>
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                Edit Attachments
              </>
            ) : (
              <>
                <PlusCircleIcon className="h-3.5 w-3.5 mr-1" />
                Add Attachments
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
                  <p className="text-sm text-gray-600">Uploading attachment...</p>
                </div>
              ) : (
                <>
                  <UploadFile 
                    onChange={(url, fileName) => handleFileUpload(url, fileName)}
                    endpoint="courseAttachments" 
                  />
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    Upload files (PDF, images, documents) - max 8MB(images) / 16MB(PDFs) / 1GB(videos)
                  </p>
                  <p className="text-gray-500 text-xs mt-1 text-center">
                    Click "Add Attachments" to upload more files
                  </p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleEdit}
                disabled={isUploading}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {initialData.attachments.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <FileIcon size={40} className="text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm font-medium">No attachments added yet</p>
                <p className="text-gray-400 text-xs mt-1">Click "Add Attachments" to upload files</p>
              </div>
            ) : (
              <div className="space-y-2">
                {initialData.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileIcon className="h-4 w-4 text-gray-500" />
                      <a
                        href={attachment.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline truncate max-w-xs"
                      >
                        {attachment.fileName || attachment.name || "Attachment"}
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(attachment.id)}
                      disabled={deletingId === attachment.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingId === attachment.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentForm;