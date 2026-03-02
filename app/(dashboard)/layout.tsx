import Sidebar from "@/components/Sidebar";


const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="h-full">
            <div className="inset-y-0 md:flex flex-col hidden z-50 h-full fixed">
                <Sidebar />
            </div>
            {children}
        </div>
    )
}
export default DashboardLayout;