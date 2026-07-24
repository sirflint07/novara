"use client";

import { PublishCourseButton } from "./publish-course-button";
import { DeleteCourseDialog } from "./delete-course-dialog";



interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
  courseTitle?: string;
  canPublish: boolean;
}

export default function CourseActions({
  disabled,
  courseId,
  isPublished,
  courseTitle,
  canPublish
}: CourseActionsProps) {
  return (
    <div className="flex items-center gap-x-10 md:gap-x-4">
      <PublishCourseButton
        courseId={courseId}
        isPublished={isPublished}
        disabled={canPublish}
      />

      <DeleteCourseDialog
        courseId={courseId}
        courseTitle={courseTitle}
      />
    </div>
  );
}