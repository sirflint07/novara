// import { Button } from '@/components/ui/button'
// import Link from 'next/link'
// import React from 'react'

// const TeachersCourses = () => {
//   return (
//     <div className='p-10'>
//       <Button variant='default'>
//         <Link href='/teacher/courses/create'>Create Course</Link>
//       </Button>
//     </div>
//   )
// }

// export default TeachersCourses


// import { Button } from '@/components/ui/button'
// import Link from 'next/link'
// import React from 'react'

// const TeachersCourses = () => {
//   return (
//     <div className='p-10'>
//       <Button variant='default'>
//         <Link href='/teacher/courses/create'>Create Course</Link>
//       </Button>
//     </div>
//   )
// }

// export default TeachersCourses


import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  PlusCircle, 
  BookOpen, 
  Users, 
  Clock, 
  Eye, 
  MoreVertical,
  Pencil,
  Trash2,
  Copy
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const TeachersCourses = async () => {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/")
  }

  // Fetch all courses for the teacher
  const courses = await db.course.findMany({
    where: {
      userId: userId,
    },
    include: {
      category: true,
      chapters: {
        select: {
          id: true,
          isPublished: true,
        },
      },
    //   enrollments: {
    //     select: {
    //       id: true,
    //     },
    //   },
    //   reviews: {
    //     select: {
    //       rating: true,
    //     },
    //   },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Calculate stats for each course
  const coursesWithStats = courses.map((course) => {
    const totalChapters = course.chapters.length
    const publishedChapters = course.chapters.filter((ch) => ch.isPublished).length
    // const totalStudents = course.enrollments.length
    // const averageRating = course.reviews.length > 0
    //   ? course.reviews.reduce((acc, curr) => acc + curr.rating, 0) / course.reviews.length
    //   : 0

    return {
      ...course,
      totalChapters,
      publishedChapters,
      // totalStudents,
      // averageRating,
      completionPercentage: totalChapters > 0 
        ? Math.round((publishedChapters / totalChapters) * 100)
        : 0,
    }
  })

  const totalCourses = coursesWithStats.length
  // const totalStudents = coursesWithStats.reduce((acc, course) => acc + course.totalStudents, 0)
  // const publishedCourses = coursesWithStats.filter((c) => c.isPublished).length

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
              My Courses
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and organize your course content
            </p>
          </div>
          <Link href="/teacher/courses/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Published</p>
            {/* <p className="text-2xl font-bold text-emerald-600">{publishedCourses}</p> */}
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Students</p>
            {/* <p className="text-2xl font-bold text-indigo-600">{totalStudents}</p> */}
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Completion Rate</p>
            {/* <p className="text-2xl font-bold text-amber-600">
              {totalCourses > 0 
                ? Math.round((publishedCourses / totalCourses) * 100) 
                : 0}%
            </p> */}
          </div>
        </div>

        {/* Courses List View */}
        {coursesWithStats.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No courses yet</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              Start creating your first course and share your knowledge with the world.
            </p>
            <Link href="/teacher/courses/create">
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Course
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* List Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-4">Course</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Chapters</div>
              <div className="col-span-2">Students</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Course Items */}
            <div className="divide-y divide-gray-100">
              {coursesWithStats.map((course) => (
                <div
                  key={course.id}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 md:px-6 py-4 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Course Info */}
                  <div className="col-span-1 md:col-span-4 flex items-center gap-3 min-w-0">
                    <div className="h-12 w-16 rounded-lg bg-linear-to-br from-blue-100 to-indigo-100 shrink-0 overflow-hidden relative">
                      {course.imageUrl ? (
                        <Image
                          src={course.imageUrl}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpen className="h-5 w-5 text-blue-400/60" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate text-sm">
                        {course.title}
                      </p>
                      {course.category && (
                        <p className="text-xs text-gray-500 truncate">
                          {course.category.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 md:col-span-2">
                    <span className={cn(
                      "text-xs px-2.5 py-1 rounded-full font-medium inline-block",
                      course.isPublished
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    )}>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  {/* Chapters */}
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {course.publishedChapters}/{course.totalChapters}
                      </span>
                      {!course.isPublished && (
                        <div className="flex-1 max-w-16">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${course.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Students */}
                  <div className="col-span-1 md:col-span-2">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      {/* {course.totalStudents} */}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-1">
                    <Link href={`/teacher/courses/${course.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/teacher/courses/${course.id}/`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeachersCourses