"use client";

import { Category } from "@prisma/client";
import {
  FcMusic,
  FcFilm,
  FcPicture,
  FcSportsMode,
  FcPackage,
  FcIdea,
  FcElectronics,
  FcDepartment,
  FcMoneyTransfer,
  FcCamera,
  FcMultipleDevices,
  FcBookmark,
  FcBusiness,
  FcReadingEbook,
  FcGraduationCap,
} from "react-icons/fc";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface CategoriesNavProps {
  items: Category[];
  selectedCategory?: string | null;
  onCategorySelect?: (categoryId: string | null) => void;
  onSearch?: (query: string) => void;
}

const iconMap: Record<string, IconType> = {
  "Development": FcMultipleDevices,
  "Technology": FcElectronics,
  "Science": FcIdea,
  "Graphic Design": FcReadingEbook,
  "Motion Graphics": FcFilm,
  "3D Animation": FcPicture,
  "Photography": FcCamera,
  "Fitness": FcSportsMode,
  "Nutrition": FcPackage,
  "Music": FcMusic,
  "History": FcReadingEbook,
  "Government": FcDepartment,
  "Economics": FcMoneyTransfer,
  "Business": FcBusiness,
  "Education": FcGraduationCap,
};

const CategoriesNav = ({ 
  items, 
  selectedCategory = null, 
  onCategorySelect,
  onSearch 
}: CategoriesNavProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialCategory = searchParams.get("category") || null;
  const initialSearch = searchParams.get("q") || "";
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    const category = searchParams.get("category") || null;
    const query = searchParams.get("q") || "";
    setSelectedCategoryId(category);
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
      return;
    }
    
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      if (selectedCategoryId) params.set("category", selectedCategoryId);
      params.set("q", searchQuery.trim());
      router.push(`${pathname}?${params.toString()}`);
    } else if (selectedCategoryId) {
      const params = new URLSearchParams();
      params.set("category", selectedCategoryId);
      router.push(`${pathname}?${params.toString()}`);
    } else {
      router.push(pathname);
    }
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    
    if (onCategorySelect) {
      onCategorySelect(categoryId);
      return;
    }
    
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
      return;
    }
    const params = new URLSearchParams();
    if (selectedCategoryId) params.set("category", selectedCategoryId);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    setSelectedCategoryId(null);
    setSearchQuery("");
    if (onCategorySelect) onCategorySelect(null);
    if (onSearch) onSearch("");
    router.push(pathname);
  };

  const hasActiveFilters = selectedCategoryId || searchQuery;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 py-2 w-full bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <div className="overflow-x-auto pb-2 scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="flex items-center gap-x-2 min-w-max">
          <button
            onClick={() => handleCategoryClick(null)}
            className={cn(
              "flex items-center gap-x-2 px-3 py-2 rounded-full border transition-all duration-200 whitespace-nowrap",
              !selectedCategoryId
                ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            )}
          >
            <FcBookmark className="h-4 w-4" />
            <span className="text-sm font-medium">All</span>
          </button>

          {items.map((category) => {
            const Icon = iconMap[category.name] || FcBookmark;
            const isActive = selectedCategoryId === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "flex items-center gap-x-2 px-3 py-2 rounded-full border transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-medium">Active filters:</span>
          {selectedCategoryId && (
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
              {items.find(c => c.id === selectedCategoryId)?.name}
            </span>
          )}
          {searchQuery && (
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
              "{searchQuery}"
            </span>
          )}
          <button
            onClick={clearAll}
            className="text-red-500 hover:text-red-700 text-xs font-medium ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoriesNav;