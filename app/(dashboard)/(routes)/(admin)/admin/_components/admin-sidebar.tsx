"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  LogOutIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { SignedIn, SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  collapsed: boolean;
}

const menuItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Courses", icon: BookOpen, href: "/admin/courses" },
  { label: "Blogs", icon: FileText, href: "/admin/blogs" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export const AdminSidebar = ({ collapsed }: AdminSidebarProps) => {
  const pathname = usePathname();
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string | null;
  const isAdmin = userRole === "ADMIN";

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  return (
  <div className="flex flex-col bg-white h-full">

    <div className="flex h-16 items-center px-4 border-b border-gray-200 shrink-0">
      <Link href="/" className="flex items-center gap-2">
        {!collapsed ? (
          <>
            <Image
              src="/logo/logo.svg"
              alt="Novara"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-gray-900">
              Novara
            </span>
            <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded">
              Admin
            </span>
          </>
        ) : (
          <Image
            src="/logo/logo.svg"
            alt="Novara"
            width={32}
            height={32}
            className="h-8 w-8 mx-auto"
          />
        )}
      </Link>
    </div>

    <ScrollArea className="flex-1 px-3 py-4">
  <nav className="space-y-1">
    {menuItems.map((item, i) => {
      const active = isActive(item.href);
      const Icon = item.icon;
      return (
        <Link
          key={i}
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            active
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            collapsed && "justify-center"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5 shrink-0",
              active ? "text-indigo-600" : "text-gray-400"
            )}
          />

          {!collapsed && (
            <span className="text-sm font-medium">
              {item.label}
            </span>
          )}
        </Link>
      );
    })}
  </nav>
</ScrollArea>

    <div className="shrink-0 border-t border-gray-200 p-4 space-y-2">

      <div className="border-t border-gray-200 pt-3">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-600">
                A
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">
                Admin
              </p>
              <p className="text-xs text-gray-500">
                admin@novara.com
              </p>
            </div>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
            <span className="text-xs font-bold text-indigo-600">
              A
            </span>
          </div>
        )}
      </div>

      <SignedIn>
        <SignOutButton>
          <Button
            variant="ghost"
            className={cn(
              "w-full text-red-500 hover:text-red-600 hover:bg-red-50",
              collapsed
                ? "justify-center"
                : "justify-start gap-2"
            )}
          >
            <LogOutIcon
              className={cn(
                "h-4 w-4",
                collapsed && "h-5 w-5"
              )}
            />

            {!collapsed && "Sign Out"}
          </Button>
        </SignOutButton>
      </SignedIn>

    </div>
  </div>
);
};