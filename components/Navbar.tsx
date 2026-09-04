"use client";

import { SignedIn, UserButton } from '@clerk/nextjs'
import NavbarItems from './NavbarItems'
import Image from 'next/image'
import { useIsMounted } from '@/hooks/is-mounted';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const isMounted = useIsMounted()
    const pathname = usePathname()
    const isTeacher = pathname.startsWith('/teacher')
    const isAdminPage = pathname.startsWith('/admin') || pathname.includes('/admin/')
    const isCoursePage = pathname.startsWith('/course') || pathname.includes('/course/')
  return (
    <>
    { isMounted && !isAdminPage && !isCoursePage && (
        <nav className='md:pl-[10vw] lg:pl-[7vw] py-4 fixed top-0 left-0 right-0 z-50 bg-white shadow-sm flex justify-between items-center w-full px-4 mb-6'>
        <div className='md:hidden'>
           <Image 
                src="/logo/logo.svg"
                alt='logo'
                width={34}
                height={34}
                className='object-contain'
            />
        </div>
        
        <div className='flex items-center justify-between gap-2 lg:gap-4'>
        <div className='hidden md:block w-0 md:w-[25vw] lg:w-[30vw] xl:w-[40vw] 2xl:w-[46vw]'></div>
            <NavbarItems />
            <div className='size-10 flex items-center justify-center rounded-full bg-gray-100'>
                { isMounted &&
                    <SignedIn >
                    <UserButton/>
                </SignedIn>}
            </div>
        </div>
    </nav>
    )}
    </>
  )
}

export default Navbar