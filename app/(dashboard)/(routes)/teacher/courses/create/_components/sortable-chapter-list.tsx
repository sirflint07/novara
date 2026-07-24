"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { GripVertical, Edit2, Trash } from "lucide-react";

interface SortableChapterItemProps {
  chapter: Chapter;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SortableChapterItem = ({
  chapter,
  index,
  onEdit,
  onDelete,
}: SortableChapterItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      suppressHydrationWarning
      className={cn(
        "group flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-200 transition-all duration-200",
        isDragging && "opacity-50 shadow-lg border-indigo-400 scale-105"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
       
        <div
          {...attributes}
          {...listeners}
          className="flex items-center gap-2 text-gray-400 cursor-grab hover:text-gray-600 transition-colors"
        >
          <GripVertical className="h-4 w-4" />
          <span className="text-xs font-medium text-gray-400 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        
        <span className="text-sm text-gray-700 truncate">{chapter.title}</span>

        <div className="flex gap-x-3 items-center">
            <span
            className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                chapter.isPublished
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            )}
            >
            {chapter.isPublished ? "Published" : "Draft"}
            </span>
            <span
            className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                chapter.isFree
                ? "bg-gray-800 text-slate-200"
                : "bg-amber-100 text-amber-700"
            )}
            >
            {chapter.isFree ? "Free" : "Paid"}
            </span>
        </div>
        
      </div>

      
      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(chapter.id)}
          className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-600"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(chapter.id)}
          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
        >
          <Trash className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};