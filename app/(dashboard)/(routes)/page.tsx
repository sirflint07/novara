"use client";

import { 
  BookOpen, 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Bell,
  Search,
  Star,
  Award,
  PlayCircle,
  ChevronRight,
  MoreVertical,
  UserPlus,
  FileText,
  Settings,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function DashboardHome() {
  // Mock data - replace with real data from your API
  const stats = [
    { label: "Total Courses", value: "14", icon: BookOpen, change: "+2", changeType: "up" },
    { label: "Total Students", value: "1,284", icon: Users, change: "+18%", changeType: "up" },
    { label: "Total Revenue", value: "$8,432", icon: DollarSign, change: "+12%", changeType: "up" },
    { label: "Course Completion", value: "67%", icon: Award, change: "-3%", changeType: "down" },
  ];

  const recentCourses = [
    { id: 1, title: "React Masterclass", students: 342, progress: 75, status: "In Progress" },
    { id: 2, title: "Node.js Fundamentals", students: 278, progress: 100, status: "Published" },
    { id: 3, title: "UI/UX Design Pro", students: 195, progress: 45, status: "Draft" },
    { id: 4, title: "Python for Data Science", students: 156, progress: 30, status: "In Progress" },
  ];

  const recentActivities = [
    { id: 1, user: "Sarah Johnson", action: "enrolled in", course: "React Masterclass", time: "2 min ago", avatar: "SJ" },
    { id: 2, user: "Mike Chen", action: "completed", course: "Node.js Fundamentals", time: "15 min ago", avatar: "MC" },
    { id: 3, user: "Emma Davis", action: "left a review", course: "UI/UX Design Pro", time: "1 hour ago", avatar: "ED" },
    { id: 4, user: "John Smith", action: "enrolled in", course: "Python for Data Science", time: "3 hours ago", avatar: "JS" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Welcome back, 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here's what's happening with your courses today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm w-48 md:w-64"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1",
                  stat.changeType === "up" 
                    ? "bg-emerald-50 text-emerald-600" 
                    : "bg-red-50 text-red-600"
                )}>
                  {stat.changeType === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">Recent Courses</h2>
                  <p className="text-sm text-gray-500">Your latest course activity</p>
                </div>
                <Link href="/teacher/courses">
                  <Button variant="ghost" size="sm" className="text-indigo-600">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentCourses.map((course) => (
                  <div key={course.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{course.title}</p>
                            <p className="text-sm text-gray-500">{course.students} students</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">
                            {course.progress}%
                          </span>
                        </div>
                        <span className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap",
                          course.status === "Published" && "bg-emerald-50 text-emerald-600",
                          course.status === "In Progress" && "bg-amber-50 text-amber-600",
                          course.status === "Draft" && "bg-gray-100 text-gray-600"
                        )}>
                          {course.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 text-xs font-medium text-indigo-600">
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">{activity.user}</span>
                        {" "}{activity.action}{" "}
                        <span className="font-medium text-indigo-600">{activity.course}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-semibold mb-2">Create New Course</h3>
              <p className="text-sm text-indigo-100 mb-4">Ready to share your knowledge with the world?</p>
              <Link href="/teacher/courses/create">
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}