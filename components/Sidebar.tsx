'use client'

import { BookOpen, ChartBar, Home, LogOutIcon, Settings, User } from 'lucide-react'
import SidebarItems from './SidebarItems'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'

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
        <div className='py-4'>
          <Link href='/' className='flex gap-1 items-center pb-1'>
            <Image 
            src="/logo/logo.svg"
            alt='logo'
            width={60}
            height={60}
            className='p-4'
            />
            <div className='text-2xl font-bold'>Novara</div>
          </Link>
          </div>
          <div className='h-1/2'>
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
            <div className='flex flex-col justify-end items-center h-1/2 gap-4 py-8'>
              <SignedOut>
                <p className='py-2 px-8 font-light cursor-pointer hover:scale-105 shadow-2xl rounded-md border border-gray-200 border-b-gray-500 bg-black text-white'>
                  <SignInButton />
                </p>

                <p className='py-2 px-8 font-light cursor-pointer hover:scale-105 shadow-2xl rounded-md border border-gray-200 border-b-gray-500 bg-slate-50 text-black'>
                  <SignUpButton />
                </p>
              </SignedOut>
              <SignedIn>
                <p className='mt-4 flex items-center justify-center gap-1 px-5 py-2 hover:bg-red-700 cursor-pointer bg-mauve-800 text-white rounded-md'>
                  <span className='inline-block'><LogOutIcon size={15}/></span><span className='inline-block'><SignOutButton /></span>
                </p>
              </SignedIn>
            </div>
    </div>
  )
}

export default Sidebar