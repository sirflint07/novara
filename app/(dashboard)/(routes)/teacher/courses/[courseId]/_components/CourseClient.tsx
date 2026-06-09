'use client'

import { DollarSignIcon, File, LayoutDashboard, ListCollapse } from "lucide-react"
import TitleForm from "../../create/_components/title-form"
import { IconBadge } from "@/components/icon-badge"
import DescriptionForm from "../../create/_components/description-form"
import ImageForm from "../../create/_components/image-form"
import CategoryForm from "../../create/_components/category-form"
import PriceForm from "../../create/_components/price-form"
import AttachmentForm from "../../create/_components/attachment-form"

interface CourseClientProps {
  course: any;
  courseId: string;
  courseTitle: string;
  courseDescription: string | null;
  courseImageUrl: string | null;
  completedFieldsCount: number;
  totalRequiredFields: number;
  courseCategory: string | null;
  coursePrice: number | null;
  categories: { value: string | null, label: string }[]
}

export const CourseClient = ({ 
  course,
  courseId, 
  courseTitle, 
  courseDescription,
  courseImageUrl,
  completedFieldsCount,
  totalRequiredFields,
  courseCategory,
  categories,
  coursePrice
}: CourseClientProps) => {
  const isCompletedText = `Completed fields - ${completedFieldsCount}/${totalRequiredFields}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <IconBadge icon={LayoutDashboard} variant="default" bgSize="md" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Course Setup
          </h1>
        </div>
        <p className="text-sm text-gray-600 ml-14">
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
          
          <DescriptionForm 
            courseId={courseId} 
            initialData={{ description: courseDescription || "" }}
            courseDescription={courseDescription || ""}
          />

          <ImageForm 
            courseId={courseId} 
            initialData={{ imageUrl: courseImageUrl }} 
          />

          <CategoryForm
            categories={categories}
            courseCategory={courseCategory}
            courseId={courseId}
            initialData={{ categoryId: courseCategory }}
          />
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-x-3">
            <IconBadge icon={ListCollapse} />
            <h1>Course Chapters</h1>
          </div>
          <h1>TODO Chapters</h1>

          <div className="space-y-4">
          <div className="flex items-center gap-x-4">
            <IconBadge icon={DollarSignIcon} variant="default" bgSize="default" iconSize="sm"/>
            <h2 className="font-semibold text-sm text-gray-600">Sell Your Course</h2>
          </div>
          <PriceForm
            courseId={courseId}
            initialData={{ price: coursePrice }}
          />
        </div>

        <div className="">
          <div className="flex items-center gap-x-4">
            <IconBadge icon={File} variant="default" bgSize="md" iconSize="sm"/>
            <h2 className="font-semibold text-sm text-gray-600">Resources & Attachments</h2>
          </div>
          <p className="text-sm text-gray-500 py-4 px-3">
            Upload any additional resources that students will need for this course.
          </p>
          <AttachmentForm 
            courseId={courseId} 
            initialData={course} 
          />
        </div>
        </div>

        
      </div>
    </div>
  );
};