"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  Form,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, BookOpen, FileText, Loader2 } from "lucide-react";

const CreatePage = () => {
  const formSchema = z.object({
    title: z.string().min(1, {
      message: "Course Title is required",
    }),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { isSubmitting, isValid, errors } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(`/api/courses`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Course created successfully", {
        position: "top-center",
        duration: 4000,
        closeButton: true,
      });
      router.push(`/teacher/courses/${response.data.id}`);
    } catch (err) {
      toast.error("Something went wrong, please try again", {
        duration: 5000,
        closeButton: true,
        position: "top-center",
      });

      console.log(err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const cardVariants = {
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <div className="max-w-5xl mx-auto my-auto h-[50vh] p-8 md:p-16">
      <div className="mb-6 ">
        <motion.h1
          variants={{ itemVariants }}
          className="mb-2 text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-r from-sky-800 to-blue-600 bg-clip-text text-transparent"
        >
          Create Your Course
        </motion.h1>
        <h1 className="text-lg md:text-2xl font-medium text-gray-700 mb-8">
          Give your course a title
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          What would you like to name your course. You can change or edit this
          course title later
        </p>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-sky-700" />
                      Course Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g Advanced Node.JS Course"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What will you be teaching in this course
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold flex items-center gap-2 mt-4">
                      <FileText className="h-4 w-4 text-sky-700" />
                      Course Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        className="placeholder:opacity-50 placeholder:text-sm"
                        placeholder="e.g Learn how to build a backend application using Node.JS and also all about middlewares, routing, databases and more"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <div className="flex items-center gap-3 mt-8 md:mt-16 lg:mt-24 justify-end">
                <motion.div
                  variants={{ cardVariants }}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link href="/teacher/courses">
                    <Button
                      variant="ghost"
                      className="cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  variants={{ cardVariants }}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    type="submit"
                    variant="default"
                    disabled={!isValid || isSubmitting}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={`cursor-pointer bg-linear-to-r from-sky-600 to-blue-600 hover:from-gray-700 hover:to-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 ${
                      !isValid || isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </Form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CreatePage;