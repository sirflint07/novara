'use client'

import { LayoutDashboard } from "lucide-react"
import TitleForm from "../../create/_components/title-form"
import { IconBadge } from "@/components/icon-badge"
import DescriptionForm from "../../create/_components/description-form"
import ImageForm from "../../create/_components/image-form"
import { CategoryDropdown } from "@/components/category-combo"

interface CourseClientProps {
  courseId: string;
  courseTitle: string;
  courseDescription: string | null;
  courseImageUrl: string | null;
  completedFieldsCount: number;
  totalRequiredFields: number;
}

export const CourseClient = ({ 
  courseId, 
  courseTitle, 
  courseDescription,
  courseImageUrl,
  completedFieldsCount,
  totalRequiredFields
}: CourseClientProps) => {
  const isCompletedText = `Completed fields - ${completedFieldsCount}/${totalRequiredFields}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <IconBadge icon={LayoutDashboard} variant="default" bgSize="md" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Course Setup
          </h1>
        </div>
        <p className="text-sm text-gray-600 ml-12">
          {isCompletedText} • Fill in the details to publish your course
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <TitleForm 
            courseId={courseId} 
            initialData={{ title: courseTitle }}
            courseTitle={courseTitle}
          />
        </div>
        
        <div className="space-y-2">
          <DescriptionForm 
            courseId={courseId} 
            initialData={{ description: courseDescription || "" }}
            courseDescription={courseDescription || ""}
          />
        </div>

        <div className='space-y-2'>
          <ImageForm 
            courseId={courseId} 
            initialData={{ imageUrl: courseImageUrl }} 
          />
        </div>

        <div className='sapce-y-2'>
          <CategoryDropdown />
        </div>
      </div>
    </div>
  );
};