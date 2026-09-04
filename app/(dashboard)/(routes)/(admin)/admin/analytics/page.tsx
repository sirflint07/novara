// app/(dashboard)/admin/analytics/page.tsx
"use client";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  FileText,
  DollarSign,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - replace with real API data
const statsData = [
  {
    label: "Total Users",
    value: "1,284",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Total Courses",
    value: "156",
    change: "+8%",
    trend: "up",
    icon: BookOpen,
  },
  {
    label: "Total Blogs",
    value: "342",
    change: "+15%",
    trend: "up",
    icon: FileText,
  },
  {
    label: "Revenue",
    value: "$8,432",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
  },
];

const monthlyData = [
  { month: "Jan", users: 65, courses: 12, revenue: 1200 },
  { month: "Feb", users: 78, courses: 15, revenue: 1800 },
  { month: "Mar", users: 90, courses: 18, revenue: 2400 },
  { month: "Apr", users: 85, courses: 14, revenue: 2100 },
  { month: "May", users: 95, courses: 20, revenue: 2800 },
  { month: "Jun", users: 110, courses: 22, revenue: 3400 },
];

const topCourses = [
  { name: "React Masterclass", students: 342, revenue: 3420, rating: 4.8 },
  { name: "Node.js Pro", students: 278, revenue: 2780, rating: 4.7 },
  { name: "UI/UX Design", students: 195, revenue: 1950, rating: 4.9 },
  { name: "Python for Data Science", students: 156, revenue: 1560, rating: 4.6 },
  { name: "Golang for Pro", students: 120, revenue: 1200, rating: 4.5 },
];

const recentActivity = [
  { id: 1, user: "John Doe", action: "enrolled in", target: "React Masterclass", time: "2 min ago" },
  { id: 2, user: "Jane Smith", action: "published", target: "Node.js Pro", time: "15 min ago" },
  { id: 3, user: "Bob Jones", action: "created a new", target: "UI/UX Design", time: "1 hour ago" },
  { id: 4, user: "Alex Chen", action: "earned a certificate", target: "Python for Data Science", time: "3 hours ago" },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500">Track platform performance and growth</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts - Placeholder for real charts */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {monthlyData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-indigo-500 rounded-t-md transition-all hover:bg-indigo-600" 
                      style={{ height: `${(item.users / 120) * 100}%` }}
                    />
                    <span className="text-xs text-gray-500">{item.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {monthlyData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-emerald-500 rounded-t-md transition-all hover:bg-emerald-600" 
                      style={{ height: `${(item.courses / 25) * 100}%` }}
                    />
                    <span className="text-xs text-gray-500">{item.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {monthlyData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-purple-500 rounded-t-md transition-all hover:bg-purple-600" 
                      style={{ height: `${(item.revenue / 4000) * 100}%` }}
                    />
                    <span className="text-xs text-gray-500">{item.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Courses & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{course.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{course.students} students</span>
                      <span>•</span>
                      <span>⭐ {course.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${course.revenue}</p>
                    <p className="text-sm text-gray-500">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>
                      {" "}{activity.action}{" "}
                      <span className="font-medium text-indigo-600">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}