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
import { X, Edit2 } from "lucide-react";
import { CategoryDropdown } from "@/components/category-combo";

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: "Category is required"
  }).nullable()
});

interface CategoryFormProps {
  initialData?: {
    categoryId: string | null
  };
  courseCategory: string | null;
  courseId: string;
  categories: { value: string | null, label: string }[]
}

const CategoryForm = ({
  courseId,
  initialData,
  courseCategory,
  categories
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || null
    }
  });

  const { isValid, isSubmitting } = form.formState;

  const handleCategoryEdit = () => {
    setIsEditing((current) => !current);
    form.reset({ categoryId: courseCategory || null });
  };

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        categoryId: values.categoryId || null
      };
      
      await axios.patch(`/api/courses/${courseId}`, payload);
      setIsEditing(false);
      router.refresh();
      toast.success("Course category updated successfully", {
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to update course category");
      console.log(`[UPDATE COURSE CATEGORY] - ${error}`);
    }
  };

  const selectedCategory = categories.find(cat => cat.value === courseCategory);

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm md:text-base font-semibold text-gray-700">Course Category</p>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCategoryEdit}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            {courseCategory ? (
              <>
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                Edit Category
              </>
            ) : (
              <>
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                Add Category
              </>
            )}
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
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CategoryDropdown 
                            options={categories} 
                            value={field.value || null}
                            onChange={(value) => {
                              field.onChange(value);
                              form.trigger("categoryId");
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
                      onClick={handleCategoryEdit}
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
                      Save
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        ) : (
          <div>
            {courseCategory ? (
              <p className="text-gray-900 font-medium">
                {selectedCategory?.label || courseCategory}
              </p>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-sm font-medium">No category selected</p>
                <p className="text-gray-400 text-xs mt-1">Click "Add Category" to choose one</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryForm;