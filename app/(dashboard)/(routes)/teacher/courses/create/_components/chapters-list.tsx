import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { GripVertical, X, Edit2 } from "lucide-react";


interface ChaptersListProps {
    items: Chapter[] | [],
    onReorder: ( updatedData : { id: string, position: number}) => void,
    onEdit: (id: string) => void,
    onDelete: (id: string) => void
}
export const ChaptersList = ({items, onReorder, onEdit, onDelete}: ChaptersListProps) => {
    return (
        <div className="space-y-2">
            {items.map((chapter, index) => (
              <div
                key={chapter.id}
                className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-gray-400">
                    <GripVertical className="h-4 w-4 cursor-grab opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-medium text-gray-400 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 truncate">
                    {chapter.title}
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    chapter.isPublished 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-amber-100 text-amber-700"
                  )}>
                    {chapter.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-600"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
    )
}