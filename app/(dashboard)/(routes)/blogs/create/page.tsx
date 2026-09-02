// app/(dashboard)/blogs/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  Loader2,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Editor } from "@/components/editor";

// ✅ Schema definition
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "REVIEW", "ARCHIVED"]).default("DRAFT"),
  category: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
  "Technology",
  "Design",
  "Development",
  "Business",
  "Marketing",
  "Lifestyle",
  "Other",
];

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "REVIEW", label: "Review" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export default function CreateBlogPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);
  const [isFeaturedImageUploading, setIsFeaturedImageUploading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      checkPermissions();
    }
  }, [isLoaded, user]);

  const checkPermissions = async () => {
    try {
      const response = await fetch("/api/users/me");
      const data = await response.json();

      if (data.role === "ADMIN" || data.role === "INSTRUCTOR") {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        toast.error("You don't have permission to create blog posts");
        setTimeout(() => router.push("/"), 2000);
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
      setIsAuthorized(false);
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      status: "DRAFT",
      category: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    },
  });

  const { watch, setValue } = form;
  const title = watch("title");
  const content = watch("content");

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleImageUpload = async (
    file: File,
    type: "cover" | "featured"
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    if (type === "cover") {
      setIsCoverImageUploading(true);
    } else {
      setIsFeaturedImageUploading(true);
    }

    try {
      const response = await axios.post("/api/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = response.data.url;

      if (type === "cover") {
        setCoverImage(url);
      } else {
        setFeaturedImage(url);
      }

      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      if (type === "cover") {
        setIsCoverImageUploading(false);
      } else {
        setIsFeaturedImageUploading(false);
      }
    }
  };

  const handleImageDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: "cover" | "featured"
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file, type);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const postData = {
        ...values,
        coverImage,
        featuredImage,
        tags,
        wordCount,
      };

      const response = await axios.post("/api/blog/posts", postData);
      toast.success("Blog post created successfully!");
      router.push(`/admin/blog/${response.data.id}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to create blog post");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  if (!isLoaded || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500">
            You don't have permission to create blog posts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Blog Post</h1>
            <p className="text-sm text-gray-500">
              Dashboard / Posts / Create New Post
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Publish Post"
            )}
          </Button>
        </div>
      </div>

      {/* ✅ FIX: ALL FormFields are now inside the Form component */}
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter blog post title..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!form.getValues("slug")) {
                            setValue("slug", generateSlug(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="enter-post-slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      The slug is the URL-friendly version of the title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Excerpt */}
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a short excerpt about your post..."
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Content <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Editor
                        value={field.value || ""}
                        onChange={(value) => {
                          field.onChange(value);
                          const words = value?.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length || 0;
                          setWordCount(words);
                        }}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between mt-2">
                      <FormMessage />
                      <span className="text-sm text-gray-400">
                        Word count: {wordCount}
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              {/* Media Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Media</h3>

                {/* Cover Image */}
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
                    coverImage
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                  )}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleImageDrop(e, "cover")}
                  onClick={() =>
                    document.getElementById("cover-upload")?.click()
                  }
                >
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, "cover");
                    }}
                  />
                  {isCoverImageUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                      <p className="text-sm text-gray-500">Uploading...</p>
                    </div>
                  ) : coverImage ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={coverImage}
                        alt="Cover image"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverImage(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        Recommended: 1200 x 630px (16:9)
                      </p>
                    </div>
                  )}
                </div>

                {/* Featured Image */}
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
                    featuredImage
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                  )}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleImageDrop(e, "featured")}
                  onClick={() =>
                    document.getElementById("featured-upload")?.click()
                  }
                >
                  <input
                    id="featured-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, "featured");
                    }}
                  />
                  {isFeaturedImageUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                      <p className="text-sm text-gray-500">Uploading...</p>
                    </div>
                  ) : featuredImage ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={featuredImage}
                        alt="Featured image"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFeaturedImage(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                      <p className="text-sm text-gray-500">Featured Image (Optional)</p>
                      <p className="text-xs text-gray-400">
                        This image will represent your post in lists.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Right Column (NOW INSIDE THE FORM) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Status */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-700">Status</h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Category */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Category</h3>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Add tags..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {tags.length === 0 && (
                      <p className="text-sm text-gray-400">No tags added yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">SEO Settings</h3>
                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Meta Title (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter meta title..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Meta Description (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter meta description..."
                            className="min-h-15"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metaKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Meta Keywords (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter keywords separated by commas..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}