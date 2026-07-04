import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import ChapterTitleForm from "../_components/chapter-title-form"

import { cn } from "@/lib/utils"

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
    }
  })

  if (!chapter) {
    return notFound()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
  
  <Button asChild
    variant="ghost"
    size="sm"
    className="mb-6 text-gray-500 hover:text-gray-700"
  >
    <Link href={`/teacher/courses/${courseId}`}>
    <ArrowLeft className="h-4 w-4 mr-2" />
    Back to Course
    </Link>
    
  </Button>

  
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-1">
      <h1 className="text-2xl font-bold text-gray-900">Chapter Setup</h1>
      <span className={cn(
        "text-xs px-3 py-1 rounded-full font-medium",
        chapter.isPublished 
          ? "bg-emerald-100 text-emerald-700" 
          : "bg-amber-100 text-amber-700"
      )}>
        {chapter.isPublished ? "Published" : "Draft"}
      </span>
    </div>
    <p className="text-gray-500 text-sm">
      Chapter {chapter.position} • Configure your chapter details
    </p>
  </div>

  
  <div className="space-y-4">
    <ChapterTitleForm
      initialData={{ title: chapter.title }}
      chapterId={chapterId}
      courseId={courseId}
    />

    {/* <ChapterDescriptionForm
      initialData={{ description: chapter.description }}
      chapterId={chapterId}
      courseId={courseId}
    />

    <ChapterVideoForm
      initialData={{ videoUrl: chapter.videoUrl }}
      chapterId={chapterId}
      courseId={courseId}
    /> */}
  </div>
</div>
  )
}

export default ChapterIdPage