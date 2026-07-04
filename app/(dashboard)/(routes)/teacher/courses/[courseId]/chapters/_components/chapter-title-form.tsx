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
import { useState, useEffect } from "react";
import { X, Edit2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

interface ChapterTitleFormProps {
  initialData: {
    title: string;
  };
  chapterId: string;
  courseId: string;
}

const ChapterTitleForm = ({
  initialData,
  chapterId,
  courseId,
}: ChapterTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
    },
    mode: "onBlur",
  });

  const { isValid, isSubmitting } = form.formState;

  const toggleEdit = () => {
    setIsEditing((current) => !current);
    form.reset({ title: initialData?.title || "" });
  };

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toggleEdit();
      router.refresh();
      toast.success("Chapter title updated successfully", {
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      console.log(`[UPDATE CHAPTER TITLE] - ${error}`);
      toast.error("Failed to update chapter title", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm md:text-base font-semibold text-gray-700">
          Chapter Title
        </p>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleEdit}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            <Edit2 className="h-3.5 w-3.5 mr-1" />
            Edit Title
          </Button>
        )}
      </div>

      <div>
        {isEditing ? (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        ) : (
          <div>
            {initialData?.title ? (
              <p className="text-gray-900 font-medium text-lg">
                {initialData.title}
              </p>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-sm font-medium">No title set</p>
                <p className="text-gray-400 text-xs mt-1">Click "Edit Title" to add one</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterTitleForm;