'use client'

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation'

interface SideBarProps {
    href: string;
    icon: LucideIcon;
    label: string;
}

const SidebarItems = ({ href, icon: Icon, label }: SideBarProps) => {
    const pathname = usePathname()
    const router = useRouter()

    const isActive = pathname === href || pathname.startsWith(`${href}/`)

    const clickHandler = () => {
        router.push(href)
    }

    return (
        <div className="md:pl-0 flex items-center transition-all duration-200">
            <button 
                onClick={clickHandler} 
                className={cn(
                    'w-full flex items-center gap-2 h-[8vh] justify-between transition-all duration-200 pl-4 cursor-pointer',
                    isActive 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
            >
                <div className='flex items-center space-x-2'>
                    <span className='inline-block'>
                        <Icon size={24} />
                    </span>
                    <span className='inline-block text-base font-semibold leading-1.5'>
                        {label}
                    </span>
                </div>
                
                <div className={cn(
                    'h-full w-0.5 p-1 transition-all duration-300',
                    isActive ? 'bg-indigo-600 text-indigo-700' : 'bg-transparent'
                )} />
            </button>
        </div>
    )
}

export default SidebarItems