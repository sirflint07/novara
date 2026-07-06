"use client";

import {
  FormItem,
  FormControl,
  FormField,
  FormMessage,
  Form,
  FormDescription,
} from "@/components/ui/form";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X, Edit2, Loader2, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";


const formSchema = z.object({
  isFree: z.boolean().default(false).optional()
});

type FormValues = z.infer<typeof formSchema>;

interface ChapterAccessFormProps {
  initialData: Chapter;
  chapterId: string;
  courseId: string;
}

const ChapterAccessForm = ({
  courseId,
  chapterId,
  initialData,
}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: Boolean(initialData?.isFree) ?? false,
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const toggleEdit = () => {
    setIsEditing((current) => !current);
    form.reset({ isFree: initialData?.isFree ?? false });
  };

  const handleFormSubmit = async (values: FormValues) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      
      toggleEdit();
      router.refresh();
      toast.success("Chapter access updated successfully", {
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      console.error("[CHAPTER_ACCESS_UPDATE]", error);
      toast.error("Failed to update chapter access", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {initialData.isFree ? (
            <Unlock className="h-5 w-5 text-emerald-500" />
          ) : (
            <Lock className="h-5 w-5 text-amber-500" />
          )}
          <div>
            <p className="text-sm md:text-base font-semibold text-gray-700">
              Chapter Access
            </p>
            <p className="text-xs text-gray-400">
              {initialData.isFree ? "Free for all students" : "Requires purchase"}
            </p>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleEdit}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            <Edit2 className="h-3.5 w-3.5 mr-1" />
            Edit Access
          </Button>
        )}
      </div>

      <div>
        {isEditing ? (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start gap-4 space-y-0 p-4 bg-white rounded-lg border border-gray-100">
                        <FormControl>
                          <Checkbox 
                            checked={field.value ?? false}
                            onCheckedChange={(checked) => field.onChange(checked ?? false)}
                            className="mt-0.5 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-700">
                            Make this chapter free
                          </p>
                          <FormDescription className="text-xs text-gray-400">
                            Students can access this chapter without purchasing the course
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center gap-2 justify-end pt-2 border-t border-gray-100">
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
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
              initialData.isFree 
                ? "bg-emerald-100 text-emerald-600" 
                : "bg-amber-100 text-amber-600"
            )}>
              {initialData.isFree ? (
                <Unlock className="h-5 w-5" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {initialData.isFree ? "Free Chapter" : "Premium Chapter"}
              </p>
              <p className="text-xs text-gray-500">
                {initialData.isFree 
                  ? "Students can access this chapter without enrollment" 
                  : "Students must purchase the course to access this chapter"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterAccessForm;