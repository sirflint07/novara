// app/(dashboard)/admin/users/[userId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Calendar, BookOpen, FileText, User, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data - replace with real data from API
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "INSTRUCTOR",
  avatar: "",
  bio: "Passionate educator with 10 years of experience in web development.",
  joined: "January 15, 2024",
  status: "Active",
  courses: [
    { id: "c1", title: "React Masterclass", students: 342, status: "Published" },
    { id: "c2", title: "Node.js Pro", students: 278, status: "Draft" },
    { id: "c3", title: "UI/UX Design", students: 195, status: "Published" },
  ],
  blogs: [
    { id: "b1", title: "10 React Tips", status: "Published", date: "Mar 10, 2024" },
    { id: "b2", title: "Node.js Best Practices", status: "Draft", date: "Mar 5, 2024" },
  ],
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  // Fetch user data based on userId

  const getRoleBadgeClass = (role: string) => {
    const roleMap: Record<string, string> = {
      ADMIN: "bg-purple-100 text-purple-700",
      INSTRUCTOR: "bg-blue-100 text-blue-700",
      STUDENT: "bg-gray-100 text-gray-700",
    };
    return roleMap[role] || "bg-gray-100 text-gray-700";
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      Published: "bg-emerald-100 text-emerald-700",
      Draft: "bg-amber-100 text-amber-700",
    };
    return statusMap[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Users
      </Button>

      {/* User Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={mockUser.avatar} />
            <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-600">
              {mockUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{mockUser.name}</h1>
              <Badge className={getRoleBadgeClass(mockUser.role)}>
                {mockUser.role}
              </Badge>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {mockUser.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {mockUser.email}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {mockUser.joined}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{mockUser.bio}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockUser.courses.length}</p>
                <p className="text-sm text-gray-500">Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockUser.blogs.length}</p>
                <p className="text-sm text-gray-500">Blogs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-500">Students Enrolled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses & Blogs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📚 Courses Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUser.courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-500">{course.students} students</p>
                  </div>
                  <Badge className={getStatusBadgeClass(course.status)}>
                    {course.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Blogs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📝 Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUser.blogs.map((blog) => (
                <div key={blog.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{blog.title}</p>
                    <p className="text-sm text-gray-500">{blog.date}</p>
                  </div>
                  <Badge className={getStatusBadgeClass(blog.status)}>
                    {blog.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}