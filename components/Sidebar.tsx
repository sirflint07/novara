'use client'

import { BookOpen, ChartBar, Home, Settings, User } from 'lucide-react'
import SidebarItems from './SidebarItems'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const Sidebar = () => {

  const pathname = usePathname()
  const isTeacher = pathname.startsWith('/teacher')
  const isCoursePage = pathname.startsWith('/course') || pathname.includes('/course/')

  const teacherRoutes = [
    {
      name: 'Analytics',
      href: '/teacher/analytics',
      icon: ChartBar
    },
    {
      name: 'Courses',
      href: '/teacher/courses',
      icon: BookOpen
    }
  ]


    const guestRoutes = [
        {
            name: 'Home',
            href: '/',
            icon: Home
        },
        {
            name: 'Profile',
            href: '/dashboard/profile',
            icon: User
        },
        {
            name: 'Settings',
            href: '/dashboard/settings',
            icon: Settings
        }
    ]

    const navItems = isTeacher ? teacherRoutes : guestRoutes

  
  return (
    <div className='flex flex-col shadow-sm overflow-y-auto bg-white h-full md:w-[20vw] lg:w-[15vw]'>
        <div className='mt-2'>
          <div className='flex gap-1 items-center mb-3'>
            <Image 
            src="/logo/logo.svg"
            alt='logo'
            width={60}
            height={60}
            className='p-4'
            />
            <div className='text-2xl font-bold'>Novara</div>
          </div>
            {
              navItems.map((item, i) => (
                <SidebarItems
                key={i}
                href={item.href}
                icon={item.icon}
                label={item.name}
                />
              ))
            }
        </div>
    </div>
  )
}

export default Sidebar