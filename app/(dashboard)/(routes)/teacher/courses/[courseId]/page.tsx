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
      id: courseId,
      userId: userId
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  })

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  })

  if (!course) {
    return redirect('/teacher/courses')
  }

  const requiredFields = [
    course.title,
    course.imageUrl,
    course.description,
    course.price,
    course.categoryId,
    course.attachments.length > 0
  ]

  const completedFieldsCount = requiredFields.filter(Boolean).length
  const totalRequiredFields = requiredFields.length

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
    />
  )
}

export default CoursePage