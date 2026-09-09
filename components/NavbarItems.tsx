"use client";

import { LogOutIcon, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import Sidebar from "./Sidebar";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { useIsMounted } from "@/hooks/is-mounted";
import { AdminSidebar } from "@/app/(dashboard)/(routes)/(admin)/admin/_components/admin-sidebar";
import { cn } from "@/lib/utils";

const NavbarItems = () => {
  const pathname = usePathname();
  const isMounted = useIsMounted();

  const isTeacherPage = pathname.startsWith("/teacher");
  const isCoursePage =
    pathname.startsWith("/courses") || pathname.includes("/courses/");
  const isAdminPage =
    pathname.startsWith("/admin") || pathname.includes("/admin/");

  const navMeunuOptions = [
    { name: "Home", href: "/dashboard", icon: Menu },
    { name: "Profile", href: "/dashboard/profile", icon: Menu },
    { name: "Settings", href: "/dashboard/settings", icon: Menu },
  ];

  const MobileSidebar = isAdminPage ? AdminSidebar : Sidebar;

  return (
    <div className="flex space-x-6 gap-6 md:justify-between items-center">
      <div className="flex space-x-5 lg:space-x-10 max-md:hidden items-center">
        {navMeunuOptions.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className="hover:text-gray-600 text-sm md:text-base"
          >
            {item.name}
          </a>
        ))}
        <div className="flex items-center gap-4">
          {isTeacherPage || isCoursePage ? (
            <Button
              asChild 
                className={cn("max-md:hidden md:block px-3 py-2 rounded-sm bg-gray-800 text-gray-100 text-xs cursor-pointer flex items-center justify-center")}
              >
                <Link href="/">
                Exit
                </Link>
              </Button>
          ) : (
            <Button
              asChild 
                className={cn("max-md:hidden md:block px-3 py-2 rounded-sm bg-gray-800 text-gray-100 text-xs cursor-pointer flex items-center justify-center")}
              >
                <Link href="/teacher/course">
                Teacher Mode
                </Link>
              </Button>
          )}

          {
            !isAdminPage && (
              <Button
              asChild 
                className={cn("max-md:hidden md:block px-3 py-2 rounded-sm bg-blue-800 text-gray-100 text-xs cursor-pointer flex items-center justify-center")}
              >
                <Link href="/admin">
                Admin Mode
                </Link>
              </Button>
            )
          }
        </div>
      </div>
      <div>
        {isMounted && (
          <Sheet>
            <SheetTrigger className="md:hidden hover:opacity-85 transition">
              <Menu className="size-8" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[85vw] sm:w-87.5">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <MobileSidebar collapsed={false} />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default NavbarItems;
