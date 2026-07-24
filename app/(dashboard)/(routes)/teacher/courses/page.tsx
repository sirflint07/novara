"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  PlusCircle,
  BookOpen,
  Users,
  Eye,
  Pencil,
  Search,
  X,
  ArrowUpDown,
  ChevronDown,
  Verified,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  isPublished: boolean;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  category: { id: string; name: string } | null;
  chapters: { id: string; isPublished: boolean }[];
  totalChapters: number;
  publishedChapters: number;
  completionPercentage: number;
  totalStudents: number;
  enrollments: { id: string }[];
}

interface Category {
  id: string;
  name: string;
}

export default function TeachersCourses() {

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"title" | "price" | "createdAt" | "chapters">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Fetch courses with filters
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        category: selectedCategory,
        status: filterStatus,
        sortBy: sortBy,
        sortOrder: sortOrder,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      const response = await axios.get(`/api/courses?${params.toString()}`);
      const data = response.data;
      
      setCourses(data.courses);
      setCategories(data.categories);
      setTotalPages(data.pagination.totalPages);
      setTotalCourses(data.pagination.total);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch when filters change
  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedCategory, filterStatus, sortBy, sortOrder, currentPage]);

  // ✅ Reset page when filters change (except page)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, filterStatus, sortBy, sortOrder]);

  // Handlers
  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setFilterStatus("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || filterStatus !== "all";

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-12 rounded-xl mb-6" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
              My Courses
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and organize your course content
            </p>
          </div>
          <Link href="/teacher/courses/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100 shadow-sm">
            <p className="text-xs md:text-sm text-gray-500">Total Courses</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100 shadow-sm">
            <p className="text-xs md:text-sm text-gray-500">Published</p>
            <p className="text-xl md:text-2xl font-bold text-emerald-600">{stats.publishedCourses}</p>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100 shadow-sm">
            <p className="text-xs md:text-sm text-gray-500">Students</p>
            <p className="text-xl md:text-2xl font-bold text-indigo-600">{stats.totalStudents}</p>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100 shadow-sm">
            <p className="text-xs md:text-sm text-gray-500">Completion</p>
            <p className="text-xl md:text-2xl font-bold text-amber-600">
              {stats.totalCourses > 0 ? Math.round((stats.publishedCourses / stats.totalCourses) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-8 h-10 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-45 h-10 text-sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-3 md:flex gap-1 p-1 bg-gray-100 rounded-lg h-10">
              <button
                onClick={() => setFilterStatus("all")}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-all",
                  filterStatus === "all"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("published")}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-1",
                  filterStatus === "published"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Verified className="h-3.5 w-3.5" />
                Published
              </button>
              <button
                onClick={() => setFilterStatus("draft")}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-1",
                  filterStatus === "draft"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <span className="h-3.5 w-3.5 rounded-full border-2 border-current" />
                Draft
              </button>
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto h-10 gap-2 text-sm">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="hidden sm:inline">Sort</span>
                  <span className="text-xs text-gray-500 ml-1 hidden md:inline">
                    ({sortBy} {sortOrder})
                  </span>
                  <ChevronDown className="h-4 w-4 ml-auto md:ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSort("title")}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("price")}>
                  <span className="h-4 w-4 mr-2 flex items-center">$</span>
                  Price {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                  <span className="h-4 w-4 mr-2">📅</span>
                  Date {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("chapters")}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Chapters {sortBy === "chapters" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-10 px-3 text-gray-500 hover:text-gray-700 text-sm"
              >
                <X className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
          </div>

          {/* Active Filters Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {searchTerm && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  Category: {categories.find((c) => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filterStatus !== "all" && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  {filterStatus === "published" ? "Published" : "Draft"}
                  <button
                    onClick={() => setFilterStatus("all")}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
          Showing {courses.length} of {totalCourses} courses
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl p-8 md:p-12 text-center border-2 border-dashed border-gray-200">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No courses found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {hasActiveFilters
                ? "Try adjusting your filters or search terms."
                : "Start creating your first course and share your knowledge with the world."}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            ) : (
              <Link href="/teacher/courses/create">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              </Link>
            )}
          </div>
        ) : (
          // Your existing course list rendering
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* List Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-4">Course</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Chapters</div>
              <div className="col-span-2">Students</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Course Items */}
            <div className="divide-y divide-gray-100">
              {courses.map((course) => (
                <div
                  key={course.id}
                  suppressHydrationWarning
                  className="group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start md:items-center px-3 md:px-6 py-3 md:py-4 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Course Info */}
                  <div className="col-span-1 md:col-span-4 flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 md:h-12 md:w-16 rounded-lg bg-linear-to-br from-blue-100 to-indigo-100 shrink-0 overflow-hidden relative">
                      {course.imageUrl ? (
                        <Image
                          src={course.imageUrl}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-blue-400/60" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate text-sm">
                        {course.title}
                      </p>
                      {course.category && (
                        <p className="text-xs text-gray-500 truncate">
                          {course.category.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 md:col-span-2 mt-1 md:mt-0">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 md:px-2.5 md:py-1 rounded-full font-medium inline-block",
                        course.isPublished
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      )}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  {/* Chapters */}
                  <div className="col-span-1 md:col-span-2 mt-1 md:mt-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {course.publishedChapters}/{course.totalChapters}
                      </span>
                      {!course.isPublished && course.totalChapters > 0 && (
                        <div className="flex-1 max-w-16 hidden sm:block">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${course.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Students */}
                  <div className="col-span-1 md:col-span-2 mt-1 md:mt-0">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      {course.totalStudents}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-1 mt-2 md:mt-0">
                    <Link href={`/teacher/courses/${course.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/teacher/courses/${course.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 md:px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="text-xs md:text-sm text-gray-500 order-2 sm:order-1">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">Previous</span>
                    <span>‹</span>
                  </Button>
                  <span className="text-sm text-gray-600 px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">Next</span>
                    <span>›</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}