'use client'

import { useState } from "react"
import { Edit2, LayoutDashboard, ShieldClose } from "lucide-react"
import TitleForm from "../../create/_components/title-form" 
import { IconBadge } from "@/components/icon-badge"
import { Button } from "@/components/ui/button"

interface CourseClientProps {
  courseId: string
  courseTitle: string
  isCompletedText: string
}

export const CourseClient = ({ 
  courseId, 
  courseTitle, 
  isCompletedText 
}: CourseClientProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleTitleEdit = () => {
    setIsEditing((current) => !current)
  }

  return (
    <div className="p-9">
      <div className="flex flex-col gap-4">
        <div className="mb-16 flex items-start gap-6">
            <div><span className="inline-block"><IconBadge icon={LayoutDashboard} variant="default" bgSize="md"/></span></div>
          <div className="">
            <h1 className="text-lg md:text-2xl font-semibold flex items-center gap-4">Course Setup Page</h1>
            <p className="text-sm md:text-base text-gray-700">
           {isCompletedText}
            </p>
          </div>
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="p-4 rounded-md bg-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm md:text-base font-medium">Course Title</p>
              {isEditing ? (
                <Button variant="ghost" className="flex items-center gap-2">
                  <span><ShieldClose size={8} /></span>
                  <span onClick={handleTitleEdit}>Cancel</span>
                </Button>
              ) : (
                <Button variant="ghost" className="flex items-center gap-2 " onClick={handleTitleEdit}>
                  <span className="inline-block">
                    <Edit2 size={10} />
                  </span>
                  <span className="inline-block">Edit Title</span>
                </Button>
              )}
            </div>
            <div>
              <TitleForm courseId={courseId} initialData={{ title: courseTitle }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}