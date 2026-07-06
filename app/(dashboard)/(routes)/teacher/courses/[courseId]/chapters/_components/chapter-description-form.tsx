"use client";

import {
  FormItem,
  FormControl,
  FormField,
  FormMessage,
  Form,
} from "@/components/ui/form";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X, Edit2, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Chapter } from "@prisma/client";
import { Preview } from "@/components/preview";

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

interface ChapterDescriptionFormProps {
  initialData?: Chapter;
  chapterId: string;
  courseId: string;
}

const ChapterDescriptionForm = ({
  courseId,
  chapterId,
  initialData,
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isValid, isSubmitting, errors } = form.formState;

  const toggleEdit = () => {
    setIsEditing((current) => !current);
    form.reset({ description: initialData?.description || "" });
  };

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Values being submitted:", values);
    console.log("Course ID:", courseId);
    console.log("Chapter ID:", chapterId);
    
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      console.log("Response received:", response.data);
      
      toggleEdit();
      router.refresh();
      toast.success("Chapter description updated successfully", {
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      console.log("=== ERROR ===");
      console.log(error);
      if (axios.isAxiosError(error)) {
        console.log("Response data:", error.response?.data);
        console.log("Response status:", error.response?.status);
        console.log("Response headers:", error.response?.headers);
      }
      toast.error("Failed to update chapter description", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm md:text-lg font-semibold text-gray-800">
          Chapter Description
        </p>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleEdit}
              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            >
              <Edit2 className="h-3.5 w-3.5 mr-1" />
              {initialData?.description ? "Edit Description" : "Add Description"}
            </Button>
          )}
        </div>
      </div>

      <div>
        {isEditing ? (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Editor
                            value={field.value || ""}
                            onChange={(content) => {
                              console.log("Editor onChange triggered, content length:", content?.length || 0);
                              field.onChange(content);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={toggleEdit}
                      disabled={isSubmitting}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      size="sm"
                      className={cn(
                        "bg-indigo-600 hover:bg-indigo-700",
                        (!isValid || isSubmitting) && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        `Save ${!isValid ? "(Invalid)" : "(Valid)"}`
                      )}
                    </Button>
                  </div>
                  
                </form>
              </Form>
            </div>
          </div>
        ) : (
          <div>
            {initialData?.description ? (
              
              <div className="bg-slate-100 py-2 px-8 rounded-2xl">
                <Preview value={initialData.description} />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <FileText size={40} className="text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm font-medium">No description added yet</p>
                <p className="text-gray-400 text-xs mt-1">Click "Add Description" to add one</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterDescriptionForm;