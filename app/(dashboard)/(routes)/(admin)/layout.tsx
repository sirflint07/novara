"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./admin/_components/admin-sidebar";
import { AdminHeader } from "./admin/_components/admin-header";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname()

  const menuItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Courses", icon: BookOpen, href: "/admin/courses" },
  { label: "Blogs", icon: FileText, href: "/admin/blogs" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

  return (
    <div className="min-h-screen bg-gray-50">

      <AdminHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileMenuClick={() => setMobileOpen(true)}
      />

      <aside
        className={cn(
          "fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 lg:block",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <AdminSidebar collapsed={sidebarCollapsed} />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />
        
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Image
                src="/logo/logo.svg"
                alt="Novara"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gray-900">Novara</span>
              <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded">
                Admin
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive ? "text-indigo-600" : "text-gray-400"
                      )}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-300 pt-16",
          "lg:ml-8",
          sidebarCollapsed ? "lg:ml-8" : "lg:ml-4"
        )}
      >
        <main className="p-4 md:p-6 lg:px-16 lg:py-8 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}