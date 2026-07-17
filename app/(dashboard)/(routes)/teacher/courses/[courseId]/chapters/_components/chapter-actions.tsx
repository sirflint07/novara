"use client";

import { DeleteChapterDialog } from "@/components/delete-chapter-dialog"; 
import { PublishChapterButton } from "@/components/publish-chapter-button"; 

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
  chapterTitle?: string;
}

export default function ChapterActions({
  disabled,
  courseId,
  chapterId,
  isPublished,
  chapterTitle,
}: ChapterActionsProps) {
  return (
    <div className="flex items-center gap-x-2">
      <PublishChapterButton
        courseId={courseId}
        isPublished={isPublished}
        disabled={disabled}
        chapterId={chapterId}
      />

      <DeleteChapterDialog
        courseId={courseId}
        chapterId={chapterId}
        chapterTitle={chapterTitle}
      />
    </div>
  );
}