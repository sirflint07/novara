'use client'

import { Link, LogOutIcon, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet'
import Sidebar from './Sidebar'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

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
        <div className='flex space-x-10 max-md:hidden'>
            {navMeunuOptions.map((item, i) => (
                <a key={i} href={item.href} className="hover:text-gray-600">
                    {item.name}
                </a>
            ))}
        </div>
        {
            isTeacherPage || isCoursePage ? (
                <Button variant='default'>
                    <LogOutIcon className='size-5'/>
                    <span>Exit</span>
                </Button>
            ) : (
                <Link href='/teacher/courses'>
                <Button>
                    Teacher Mode
                </Button>
                </Link>
            )
        }
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