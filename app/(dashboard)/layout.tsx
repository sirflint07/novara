'use client'

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";


const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    const pathname = usePathname();

    const isAdminPage = pathname.startsWith('/admin') || pathname.includes('/admin/')
    const isCoursePage = pathname.startsWith('/course') || pathname.includes('/course/')

    if (!isAdminPage || !isCoursePage) {
       return (
       <div className="h-full">
            <Navbar />
            <div className="inset-y-0 md:flex flex-col hidden z-50 h-full fixed">
                <Sidebar />
            </div>
            <div className="md:ml-[20vw] lg:ml-[15vw]">
                {children}
            </div>
        </div>
    )}
    
}
export default DashboardLayout;