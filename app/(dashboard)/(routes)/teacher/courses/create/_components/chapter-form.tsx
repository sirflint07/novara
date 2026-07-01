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
import { PlusCircle, GripVertical, Loader2, X, FileText, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { ChaptersList } from "./chapters-list";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Chapter title is required"
  })
});

interface ChaptersFormProps {
  initialData?: Course & { chapters: Chapter[] };
  courseId: string;
}

const ChaptersForm = ({
  courseId,
  initialData
}: ChaptersFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    },
    mode: "onBlur"
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
    form.reset({ title: "" });
  };

  const handleDeleteChapter = async () => {
    console.log("delete")
  }

  const handleEditChapter = async () => {
    console.log("delete")
  }

  const handleReorderChapters = async () => {
    console.log("reorder")
  }

  const { isValid, isSubmitting } = form.formState;
  const router = useRouter();

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toggleCreating();
      router.refresh();
      toast.success("Chapter created successfully", {
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      console.log(`[CREATE CHAPTER] - ${error}`);
      toast.error("Something went wrong, please try again", {
        position: "top-center"
      });
    }
  };

  const chapters = initialData?.chapters || [];

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm md:text-base font-semibold text-gray-700">
            Course Chapters
          </p>
          <p className="text-xs text-gray-400">
            {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"} total
          </p>
        </div>
        {!isCreating && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCreating}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            Add Chapter
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="mb-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. Introduction to React"
                        {...field}
                        className="focus:ring-indigo-500"
                        autoFocus
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
                  onClick={toggleCreating}
                  disabled={isSubmitting}
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Chapter"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      <div>
        {(chapters.length === 0 && initialData?.chapters.length !== 0) && !isCreating ? (
          <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
            <FileText size={40} className="text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm font-medium">No chapters added yet</p>
            <p className="text-gray-400 text-xs mt-1">Click "Add Chapter" to start building your course</p>
          </div>
        ) : (
          <ChaptersList items={initialData?.chapters || []}
          onDelete={handleDeleteChapter}
          onReorder={handleReorderChapters}
          onEdit={handleEditChapter}
          />
        )}

        {/* Drag & Drop Hint */}
        {chapters.length > 1 && (
          <p className="text-xs text-gray-400 mt-3 text-center flex items-center justify-center gap-1">
            <GripVertical className="h-3 w-3" />
            Drag and drop to reorder chapters
          </p>
        )}
      </div>
    </div>
  );
};

export default ChaptersForm;