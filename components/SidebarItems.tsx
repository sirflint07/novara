'use client'

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation'

interface SideBarProps {
    href: string;
    icon: LucideIcon;
    label: string;
}

const SidebarItems = ({href, icon: Icon, label}: SideBarProps) => {
const pathname = usePathname()
const router = useRouter()

const isActive = (pathname === href) || pathname.startsWith(`${href}/`) || (href === '/' && pathname === '/')

const clickHandler = () => {
    router.push(href)
}
    
  return (
    <div className='space-y-6 pl-2'>
        <button onClick={clickHandler} className={
            cn(
                'w-full',
                isActive ? 'bg-blue-500/10 text-blue-500' : 'text-gray-700 hover:bg-gray-200'
            )
        }>
            <a href={href} className="flex items-center hover:bg-gray-200 gap-2 h-[8vh] justify-between">
                <div className='flex items-center space-x-2 pl-3'>
                    <span className='inline-block'><Icon size={24} /></span>
                    <span className='inline-block text-base font-bold'>{label}</span>
                </div>
                
                <div className={cn(
                'h-full w-0.5 bg-gray-300 p-1 transition-all duration-300',
                isActive ? 'bg-blue-500' : 'bg-transparent'
            )}/>
            </a>
        </button>
    </div>
  )
}

export default SidebarItems