'use client'

import { LogOutIcon, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet'
import Sidebar from './Sidebar'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import Link from 'next/link'

const NavbarItems = () => {
    const pathname = usePathname()

    const isTeacherPage = pathname.startsWith('/teacher')
    const isCoursePage = pathname.startsWith('/course') || pathname.includes('/course/')

    const navMeunuOptions = [
        {
            name: 'Home',
            href: '/dashboard',
            icon: Menu
        },
        {
            name: 'Profile',
            href: '/dashboard/profile',
            icon: Menu
        },
        {
            name: 'Settings',
            href: '/dashboard/settings',
            icon: Menu
        }
    ]
  return (
    <div className="flex space-x-6 gap-6 md:justify-between items-center">
        <div className='flex space-x-5 lg:space-x-10 max-md:hidden items-center'>
            {navMeunuOptions.map((item, i) => (
                <a key={i} href={item.href} className="hover:text-gray-600 text-sm md:text-base">
                    {item.name}
                </a>
            ))}
            <div className='flex items-center'>
            {
            isTeacherPage || isCoursePage ? (
                <Link href='/'>
                    <Button variant='default'>
                        <LogOutIcon className='size-5'/>
                        <span>Exit</span>
                    </Button>
                </Link>
            ) : (
                <Link href='/teacher/courses'>
                <Button>
                    Teacher Mode
                </Button>
                </Link>
            )
        }
        </div>
        </div>
        <div>
           <Sheet>
            <SheetTrigger className="md:hidden hover:opacity-85 transition">
                <Menu className='size-8' />
            </SheetTrigger>
            <SheetContent side='left' title='nav' className='p-0'>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <Sidebar />
            </SheetContent>
            </Sheet> 
        </div>
    </div>
  )
}

export default NavbarItems