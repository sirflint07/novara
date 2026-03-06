'use client'

import { BookOpen, ChartBar, Home, LogOutIcon, Settings, User } from 'lucide-react'
import SidebarItems from './SidebarItems'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from './ui/button'

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
        <div className='mt-2 h-full'>
          <Link href='/' className='flex gap-1 items-center mb-4'>
            <Image 
            src="/logo/logo.svg"
            alt='logo'
            width={60}
            height={60}
            className='p-4'
            />
            <div className='text-2xl font-bold'>Novara</div>
          </Link>
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
            <div className='flex justify-center items-end h-[65%]'>
              <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button variant='destructive' className='mt-4 flex items-end justify-center gap-1 px-4 py-2 hover:bg-red-700 cursor-pointer'>
                  <span className='inline-block'><LogOutIcon /></span><span className='inline-block'>Logout</span>
                </Button>
              </SignedIn>
            </div>
        </div>
    </div>
  )
}

export default Sidebar