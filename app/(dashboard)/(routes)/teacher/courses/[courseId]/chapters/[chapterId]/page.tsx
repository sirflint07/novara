import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookmarkCheckIcon, BookOpen, CheckCircle, Eye, LayoutDashboard, ListChecks, Video } from "lucide-react"
import Link from "next/link"
import ChapterTitleForm from "../_components/chapter-title-form"
import { cn } from "@/lib/utils"
import ChapterDescriptionForm from "../_components/chapter-description-form"
import { IconBadge } from "@/components/icon-badge"
import ChapterAccessForm from "../_components/chapter-access-form"
import ChapterVideoForm from "../_components/chapter-video-form"
import { Banner } from "@/components/banner"
import ChapterActions from "../_components/chapter-actions"

const ChapterIdPage = async ({ params }: { params: Promise<{ chapterId: string; courseId: string }> }) => {
  const { chapterId, courseId } = await params
  const { userId } = await auth()

  if (!userId) {
    return redirect('/')
  }

  const chapter = await db.chapter.findFirst({
    where: {
      id: chapterId,
      courseId: courseId,
      course: {
        userId: userId
      }
    },
    include: {
      muxData: true
    }
  })

  console.log("Chapter data:", chapter)
  console.log("MuxData:", chapter?.muxData)

  if (!chapter) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
        <BookOpen className="h-10 w-10 text-red-500" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Chapter Not Found
      </h1>
      <p className="text-gray-500 max-w-md mb-8">
        The chapter you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
        <Link href={`/teacher/courses/${courseId}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Link>
      </Button>
    </div>
  )
}

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
    chapter.isFree === chapter.isFree
  ]

  const completedFields = requiredFields.filter(Boolean).length
  const completedFieldsText = `${completedFields} of ${requiredFields.length} fields completed`
  const isComplete = requiredFields.every(Boolean)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-4">
          {chapter.isPublished ? (
      <Banner 
        variant="success" 
        label="Chapter is in Live Mode"
        description="This chapter is now available to all students unless you unpublish or delete it"
        className="mb-6"
      />
    ):
    (
      <Banner 
        variant="warning" 
        label="Chapter is in Draft Mode"
        description="This chapter is not visible to students until you publish it."
        className="mb-6"
      />
    )
    }
        </div>
      
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-6 text-gray-500 hover:text-gray-700"
      >
        <Link href={`/teacher/courses/${courseId}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Link>
      </Button>
      <div className="flex items-baseline justify-between">
          <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
              Chapter Setup
            </h1>
            <span className={cn(
              "text-xs px-3 py-1 rounded-full font-medium",
              chapter.isPublished || completedFields === 4
                ? "bg-emerald-100 text-emerald-700" 
                : "bg-gray-500 text-slate-100"
            )}>
              {chapter.isPublished || completedFields === 4 ? "Completed" : "Draft"}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {completedFieldsText}
            </span>
            <span className={completedFields === 4 ? "rounded-full p-1 bg-emerald-600" : ""}>{completedFields === 4 && <CheckCircle color="white" className="size-3" />}</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Chapter {chapter.position} • Configure your chapter details
          </p>
        </div>

        <div>
          <ChapterActions
          disabled={!isComplete}
          courseId={courseId}
          chapterId={chapterId}
          isPublished={chapter.isPublished}
          />
        </div>
      </div>
      

      

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center space-x-5 mb-4">
              <IconBadge icon={BookmarkCheckIcon} iconSize={"md"} variant="default" bgSize="md" />
              <p>Chapter Video</p>
            </div>
            <ChapterTitleForm
            initialData={{ title: chapter.title }}
            chapterId={chapterId}
            courseId={courseId}
          />
          </div>
          <div>
            <ChapterDescriptionForm
            initialData={chapter}
            chapterId={chapterId}
            courseId={courseId}
          />
          </div>
          <div>
            <ChapterAccessForm
            initialData={chapter}
            chapterId={chapterId}
            courseId={courseId}
          />
          </div>
          
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="flex items-center space-x-5 mb-4">
              <IconBadge icon={Video} iconSize={"md"} variant="default" bgSize="md" />
              <p>Chapter Video</p>
            </div>
            <ChapterVideoForm 
            initialData= { chapter }
            courseId={courseId}
            chapterId={chapterId}
            />
          </div>
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <IconBadge icon={LayoutDashboard} variant="default" bgSize="md" />
              <p className="text-sm font-semibold text-gray-700">Chapter Status</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={cn(
                  "font-medium",
                  chapter.isPublished ? "text-emerald-600" : "text-amber-600"
                )}>
                  {chapter.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Position</span>
                <span className="font-medium text-gray-700">Chapter {chapter.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chapters</span>
                <span className="font-medium text-gray-700">{completedFieldsText}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-linear-to-br from-indigo-50 to-purple-50 border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="h-4 w-4 text-indigo-600" />
              <p className="text-sm font-semibold text-gray-700">Progress</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-indigo-600">
                  {completedFields}/{requiredFields.length}
                </span>
              </div>
              <div className="h-2 bg-indigo-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${(completedFields / requiredFields.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Complete all fields to publish this chapter
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterIdPage