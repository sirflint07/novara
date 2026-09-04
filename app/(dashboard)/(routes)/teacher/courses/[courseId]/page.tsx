import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CourseClient } from "./_components/CourseClient"

const CoursePage = async ({ params }: { params: Promise<{ courseId: string }> }) => {
  const { courseId } = await params

  const { userId: clerkId } = await auth() // ← Rename to clerkId
  if (!clerkId) {
    return redirect('/')
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })

  if (!user) {
    return redirect('/teacher/courses')
  }

 
  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId: user.id
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc"
        }
      },
      attachments: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  })

  if (!course) {
    return redirect('/teacher/courses')
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  })

  const courseFields = [
    course.title,
    course.imageUrl,
    course.description,
    course.price,
    course.categoryId
  ]
  
  const hasAllCourseFields = courseFields.every(Boolean)
  const hasAttachments = course.attachments.length > 0
  const hasChapters = course.chapters.length > 0
  const hasPublishedChapters = course.chapters.some((chapter) => chapter.isPublished)
  const allChaptersHaveVideo = course.chapters.every((chapter) => chapter.videoUrl)

  const requiredFields = [
    ...courseFields,
    hasAttachments,
    hasChapters
  ]
  
  const completedFieldsCount = requiredFields.filter(Boolean).length
  const totalRequiredFields = requiredFields.length

  const canPublish = hasAllCourseFields && hasChapters && !hasPublishedChapters

  const isComplete = hasAllCourseFields && hasChapters && hasPublishedChapters

  return (
    <CourseClient
      course={course}
      courseId={courseId}
      courseTitle={course.title}
      courseDescription={course.description}
      courseImageUrl={course.imageUrl}
      completedFieldsCount={completedFieldsCount}
      totalRequiredFields={totalRequiredFields}
      courseCategory={course.categoryId}
      coursePrice={course.price}
      categories={categories.map((category) => ({ 
        value: category.id,
        label: category.name
      }))}
      canPublish={isComplete || canPublish}
      isComplete={isComplete}
      hasPublishedChapters={hasPublishedChapters}
      hasAllCourseFields={hasAllCourseFields}
      hasChapters={hasChapters}
    />
  )
}

export default CoursePage