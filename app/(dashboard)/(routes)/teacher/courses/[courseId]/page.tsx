import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CourseClient } from "./_components/CourseClient"

const CoursePage = async ({ params }: { params: Promise<{ courseId: string }> }) => {
  const { courseId } = await params

  const { userId } = await auth()
  if (!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId
    }
  })

  if (!course) {
    return redirect('/')
  }

  const requiredFields = [
    course?.title,
    course?.imageUrl,
    course?.description,
    course?.price,
    course?.categoryId
  ]

  const totalRequiredFields = requiredFields.length
  const completedFieldsCount = requiredFields.filter(Boolean).length
  const isCompletedText = `Completed fields - ${completedFieldsCount}/${totalRequiredFields}`

  return (
    <CourseClient 
      courseId={courseId}
      courseTitle={course.title}
      isCompletedText={isCompletedText}
    />
  )
}

export default CoursePage