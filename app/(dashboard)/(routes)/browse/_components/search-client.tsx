// app/(public)/search/_components/search-client.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoriesNav from "./categories-nav";
import { Category } from "@prisma/client";

interface SearchClientProps {
  categories: Category[];
}

export default function SearchClient({ categories }: SearchClientProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const query = searchParams.get("q");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (query) params.set("q", query);
      
      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [category, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CategoriesNav items={categories} />
      
      {/* Your course grid here */}
      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <div key={course.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}