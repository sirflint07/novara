'use client'

import { AlertCircle, Check, CheckCircle, DollarSignIcon, File, Info, LayoutDashboard, ListCollapse, X, XCircle } from "lucide-react"
import TitleForm from "../../create/_components/title-form"
import { IconBadge } from "@/components/icon-badge"
import DescriptionForm from "../../create/_components/description-form"
import ImageForm from "../../create/_components/image-form"
import CategoryForm from "../../create/_components/category-form"
import PriceForm from "../../create/_components/price-form"
import { Course } from "@prisma/client"
import ChaptersForm from "../../create/_components/chapter-form"
import AttachmentForm from "../../create/_components/attachment-form"
import { Banner } from "@/components/banner"
import CourseActions from "./course-actions"
import { cn } from "@/lib/utils"
import { useIsMounted } from "@/hooks/is-mounted"

interface CourseClientProps {
  course: Course & { chapters: any[], attachments: any[] }
  courseId: string
  courseTitle: string
  courseDescription: string | null
  courseImageUrl: string | null
  completedFieldsCount: number
  totalRequiredFields: number
  courseCategory: string | null
  coursePrice: number | null
  categories: { value: string | null, label: string }[]
  canPublish: boolean
  isComplete: boolean
  hasPublishedChapters: boolean
  hasAllCourseFields: boolean
  hasChapters: boolean
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
  coursePrice,
  canPublish,
  isComplete,
  hasPublishedChapters,
  hasAllCourseFields,
  hasChapters
}: CourseClientProps) => {
  const isCompletedText = `${completedFieldsCount}/${totalRequiredFields} fields completed`

  const getPublishStatus = () => {
    if (course.isPublished) {
      return {
        canPublish: false,
        message: "Course is already published",
        variant: "info" as const
      }
    }
    
    if (!hasAllCourseFields) {
      return {
        canPublish: false,
        message: "Complete all course fields first",
        variant: "warning" as const
      }
    }
    
    if (!hasChapters) {
      return {
        canPublish: false,
        message: "Add at least one chapter",
        variant: "warning" as const
      }
    }
    
    if (hasPublishedChapters) {
      return {
        canPublish: false,
        message: "Course already has published chapters",
        variant: "info" as const
      }
    }
    
    return {
      canPublish: true,
      message: "Ready to publish!",
      variant: "success" as const
    }
  }

  const publishStatus = getPublishStatus()

  const isMounted = useIsMounted()
  if (!isMounted) return null

  return (
    <>
      <div className="max-w-4xl lg:max-w-6xl mx-auto pb-12 pt-8 lg:-pl-16 pl-0 mt-16">
        {isComplete && course.isPublished ? (
          <div>
            <Banner
              variant="success"
              label="This course is in Live mode because it has been published"
            />
          </div>
        ) : (
          <div>
            <Banner
              variant="info"
              label="This course is in Draft mode as it is not yet published"
            />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="flex-col md:flex md:flex-row justify-between">
          <div className="mb-8 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <IconBadge icon={LayoutDashboard} variant="default" bgSize="md" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Course Setup
              </h1>
            </div>
            <p className="text-sm text-gray-600 ml-12">
              {isCompletedText} • {publishStatus.message}
            </p>
          </div>

          <div className="pl-4 md:pl-0 mb-8 md:mb-0">
            <CourseActions
              courseId={courseId}
              disabled={isComplete === false}
              isPublished={course.isPublished && isComplete}
              canPublish={canPublish == false}
              courseTitle={courseTitle}
            />
          </div>
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

            <div>
              <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Publish Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-600">Course Fields</span>
                    <span
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium",
                        hasAllCourseFields
                          ? "text-emerald-600"
                          : "text-amber-600",
                      )}
                    >
                      {hasAllCourseFields ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Complete
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          Incomplete
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-600">Chapters</span>
                    <span
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium",
                        hasChapters ? "text-emerald-600" : "text-amber-600",
                      )}
                    >
                      {hasChapters ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          {course.chapters?.length || 0} added
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          No chapters
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-600">
                      Published Chapters
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium",
                        hasPublishedChapters
                          ? "text-emerald-600"
                          : "text-amber-600",
                      )}
                    >
                      {!hasPublishedChapters ? (
                        <>
                          <X className="h-4 w-4" />
                          None published
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          {
                            course.chapters?.filter((ch) => ch.isPublished)
                              .length
                          }{" "}
                          published
                        </>
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 my-2" />

                  <div className="flex items-center justify-between p-3 rounded-lg bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                    <span className="text-sm font-semibold text-gray-700">
                      Ready to Publish
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-2 text-sm font-bold",
                        hasPublishedChapters && hasAllCourseFields ? "text-emerald-600" : "text-red-500",
                      )}
                    >
                      {hasPublishedChapters && hasAllCourseFields ? (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Yes
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5" />
                          No
                        </>
                      )}
                    </span>
                  </div>

                  {!canPublish && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
                      <Info className="h-4 w-4 text-amber-500 mt-0.5" />
                      <p className="text-xs text-amber-700">
                        {publishStatus.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-x-3">
              <IconBadge icon={ListCollapse} />
              <h1 className="text-lg font-semibold">Course Chapters</h1>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-x-3">
                <IconBadge
                  icon={ListCollapse}
                  iconSize={"sm"}
                  variant={"default"}
                  bgSize={"md"}
                />
                <h1 className="text-sm font-semibold text-gray-700">
                  Create Your Course Chapters
                </h1>
              </div>
              <ChaptersForm initialData={course} courseId={courseId} />

              <div className="space-y-4">
                <div className="flex items-center gap-x-4">
                  <IconBadge
                    icon={DollarSignIcon}
                    variant="default"
                    bgSize="default"
                    iconSize="sm"
                  />
                  <h2 className="font-semibold text-sm text-gray-600">
                    Sell Your Course
                  </h2>
                </div>
                <PriceForm
                  courseId={courseId}
                  initialData={{ price: coursePrice }}
                />
              </div>

              <div className="">
                <div className="flex items-center gap-x-4">
                  <IconBadge
                    icon={File}
                    variant="default"
                    bgSize="md"
                    iconSize="sm"
                  />
                  <h2 className="font-semibold text-sm text-gray-600">
                    Resources & Attachments
                  </h2>
                </div>
                <p className="text-sm text-gray-500 py-4 px-3">
                  Upload any additional resources that students will need for
                  this course.
                </p>
                <AttachmentForm courseId={courseId} initialData={course} />
              </div>
            </div>

            <PriceForm
              courseId={courseId}
              initialData={{ price: coursePrice }}
            />
          </div>
        </div>
      </div>
    </>
  );
}