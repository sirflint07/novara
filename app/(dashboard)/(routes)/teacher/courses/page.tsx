import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const TeachersCourses = () => {
  return (
    <div className='p-10'>
      <Button variant='default'>
        <Link href='/teacher/courses/create'>Create Course</Link>
      </Button>
    </div>
  )
}

export default TeachersCourses