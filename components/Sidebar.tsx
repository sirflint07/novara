'use client'

import { Home, Settings, User } from 'lucide-react'
import SidebarItems from './SidebarItems'
import Image from 'next/image'

const Sidebar = () => {
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

    const navItems = guestRoutes

  
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