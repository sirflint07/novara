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
import { ShieldClose, Edit2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  description: z.string().min(1, {
   message: "Description is required and it cannot be less than a character"
  })
});

interface DescriptionFormProps {
  initialData?: {
    description: string
  };
  courseDescription: string;
  courseId: string;
}

const DescriptionForm = ({
  courseId,
  initialData,
  courseDescription,
}: DescriptionFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
    mode: "onBlur"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleDescriptionEdit = () => {
    setIsEditing((current) => !current);
  };

  const { isValid, isSubmitting, errors } = form.formState;
  const router = useRouter();

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      handleDescriptionEdit()
      router.refresh();
      toast.success("Course Description updated successfully", {
        position: "top-left",
        duration: 3000,
        dismissible: true,
      });
    } catch (error) {
      console.log(`[UPDATE COURSE] - ${error}`);
    }
  };

  return (
    <div>
      <div className="p-4 rounded-md bg-slate-100">
        <div className="flex items-center justify-between">
          <p className="text-sm md:text-base font-medium">Course Description</p>
          {isEditing ? (
            <Button variant="ghost" className="flex items-center gap-2">
              <span>
                <ShieldClose size={8} />
              </span>
              <span onClick={handleDescriptionEdit}>Cancel</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="flex items-center gap-2 "
              onClick={handleDescriptionEdit}
            >
              <span className="inline-block">
                <Edit2 size={10} />
              </span>
              <span className="inline-block">Edit Description</span>
            </Button>
          )}
        </div>
        <div>
          {isEditing ? (
            <div className="bg-white rounded-lg p-2 border border-gray-300 focus:outline-none w-full mt-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            disabled={ isSubmitting }
                            placeholder="e.g. Advanced React"
                            {...field}
                            className="p-2 rounded-md focus:outline-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  <Button
                    disabled={ isSubmitting || !isValid}
                    className="mt-2"
                    type="submit"
                  >
                    Save
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <p className={cn(
               "text-sm",
               courseDescription ? "text-gray-700 font-bold opacity-80 italic": "text-base text-slate-700 font-semibold"
            )}>{!courseDescription ? "No course description added": courseDescription }</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DescriptionForm;