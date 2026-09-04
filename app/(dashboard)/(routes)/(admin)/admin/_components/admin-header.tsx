"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Moon,
  Sun,
  User,
  Menu,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOutIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface AdminHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onMobileMenuClick: () => void;
}

const getPageTitle = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0 || segments[0] === "admin") return "Overview";
  if (segments[1] === "users") return "Users Management";
  if (segments[1] === "courses") return "Courses Management";
  if (segments[1] === "blogs") return "Blogs Management";
  if (segments[1] === "analytics") return "Analytics";
  if (segments[1] === "settings") return "Settings";
  if (segments[1] === "users" && segments[2]) return "User Details";
  return "Dashboard";
};

export const AdminHeader = ({
  sidebarCollapsed,
  onToggleSidebar,
  onMobileMenuClick,
}: AdminHeaderProps) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const {user, isLoaded} = useUser()
  const userRole = user?.publicMetadata?.role as string | null
  const isAdmin = userRole === 'ADMIN'

  const pageTitle = getPageTitle(pathname);
  const isTeacherPage = pathname === '/teacher' || pathname.includes('/teacher') || pathname.startsWith('/teacher')
  const isCoursePage = pathname === 'courses' || pathname.includes('/courses') || pathname.startsWith('/courses')
  const isAdminPage = pathname === 'admin' || pathname.includes('/admin') || pathname.startsWith('/admin')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 py-8">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 w-[30%]">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMobileMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={onToggleSidebar}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {pageTitle}
            </h1>
            <p className="hidden text-sm text-gray-500 md:block">
              Manage your platform from here
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-8 md:gap-20 w-[65%]">
          <div className="md:w-20 md:mr-12 w-fit text-sm md:text-base flex items-center gap-2 pr-16">
            {
            isAdminPage && (
                <Link href='/teacher/courses' className="hidden lg:visible md:inline-block">
                <Button>
                    Teacher Mode
                </Button>
                </Link>
            )
        }
                {isAdmin && <Link href="/" className="hidden lg:visible md:inline-block">
                    <Button variant='default'>
                        <LogOutIcon className='size-5'/>
                        <span>Exit</span>
                    </Button>
                </Link>}
          </div>
        <div className="flex items-center gap-4 ml-8">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-48 h-9 text-sm"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-red-500">
              3
            </Badge>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden sm:flex"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-600">A</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>
      </div>
    </header>
  );
};