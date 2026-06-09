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
import { X, Edit2, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";

const formSchema = z.object({
  price: z.number().min(0.01, {
    message: "Price must be at least $0.01"
  })
});

interface PriceFormProps {
  initialData?: {
    price: number | null;
  };
  courseId: string;
}

const PriceForm = ({
  courseId,
  initialData,
}: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price ?? 0
    }
  });

  const { isValid, isSubmitting } = form.formState;

  const handlePriceEdit = () => {
    setIsEditing((current) => !current);
    form.reset({ price: initialData?.price ?? 0 });
  };

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      setIsEditing(false);
      router.refresh();
      toast.success("Course price updated successfully", {
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to update course price");
      console.log(`[UPDATE COURSE PRICE] - ${error}`);
    }
  };


  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm md:text-base font-semibold text-gray-700">Course Price</p>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePriceEdit}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            {initialData?.price ? (
              <>
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                Edit Price
              </>
            ) : (
              <>
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                Add Price
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                              $
                            </span>

                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              disabled={isSubmitting}
                              placeholder="0.00"
                              value={field.value ?? 0}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="pl-7 focus:ring-indigo-500"
                            />
                          </div>
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
                      onClick={handlePriceEdit}
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
            {initialData?.price ? (
              <p className="text-gray-900 font-medium text-lg">
                {/* ${initialData.price.toLocaleString()} */}
                {formatPrice(initialData.price)}
              </p>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <DollarSign size={40} className="text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm font-medium">No price set</p>
                <p className="text-gray-400 text-xs mt-1">Click "Add Price" to set one</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceForm;