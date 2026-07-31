"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import CategoriesNav from "./categories-nav";
import { Category } from "@prisma/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  isPublished: boolean;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  totalChapters: number;
  publishedChapters: number;
  completionPercentage: number;
  attachments: any[];
}

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const query = searchParams.get("q");
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishedCourses, setPublishedCourses] = useState<Course[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (category) params.set("category", category);
      if (query) params.set("q", query);
      
      const url = `/api/courses${params.toString() ? `?${params.toString()}` : ''}`;
      console.log("Fetching URL:", url);
      
      const response = await axios.get(url);
      const data = response.data;
      console.log("DATA:", data);
      
      setCourses(data.courses || []);
      const onlyPublished = data.courses.filter((course: Course) => course.isPublished === true);
      setPublishedCourses(onlyPublished);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [category, query]);

  return (
    <div className="max-w-7xl mx-auto md:px-16 px-4 py-8">
      <CategoriesNav items={categories} />
      
      <div className="mt-8 mb-4">
        <p className="text-sm text-gray-500">
          {loading ? "Loading..." : `${publishedCourses.length} courses found`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : publishedCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No courses found</h3>
          <p className="text-sm text-gray-500 mt-1">
            {category || query ? "Try adjusting your search or filter criteria." : "No courses available yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {publishedCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">
                {course.imageUrl ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      course.isPublished ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                    )}>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                    {course.category && (
                      <span className="text-xs text-gray-400">
                        {course.category.name}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{course.publishedChapters}/{course.totalChapters} chapters</span>
                    </div>
                    {course.price ? (
                      <span className="font-bold text-indigo-600">${course.price}</span>
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium">Free</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}