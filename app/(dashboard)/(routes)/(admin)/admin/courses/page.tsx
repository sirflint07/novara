// // app/(dashboard)/admin/courses/page.tsx
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   Plus,
//   Search,
//   Eye,
//   Pencil,
//   Trash2,
//   MoreHorizontal,
//   ChevronLeft,
//   ChevronRight,
//   BookOpen,
//   Users,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Card, CardContent } from "@/components/ui/card";

// // Mock data - replace with real API data
// const mockCourses = [
//   {
//     id: "1",
//     title: "React Masterclass",
//     instructor: "John Doe",
//     category: "Technology",
//     students: 342,
//     status: "Published",
//     price: 49.99,
//     rating: 4.8,
//     date: "Jan 15, 2024",
//   },
//   {
//     id: "2",
//     title: "Node.js Pro",
//     instructor: "Jane Smith",
//     category: "Development",
//     students: 278,
//     status: "Draft",
//     price: 39.99,
//     rating: 4.7,
//     date: "Feb 20, 2024",
//   },
//   {
//     id: "3",
//     title: "UI/UX Design",
//     instructor: "John Doe",
//     category: "Design",
//     students: 195,
//     status: "Published",
//     price: 29.99,
//     rating: 4.9,
//     date: "Mar 10, 2024",
//   },
//   {
//     id: "4",
//     title: "Python for Data Science",
//     instructor: "Alex Chen",
//     category: "Technology",
//     students: 156,
//     status: "Archived",
//     price: 59.99,
//     rating: 4.6,
//     date: "Feb 5, 2024",
//   },
//   {
//     id: "5",
//     title: "Golang for Pro",
//     instructor: "Sarah Lee",
//     category: "Development",
//     students: 120,
//     status: "Published",
//     price: 44.99,
//     rating: 4.5,
//     date: "Jan 28, 2024",
//   },
// ];

// const statusColors = {
//   Published: "bg-emerald-100 text-emerald-700",
//   Draft: "bg-amber-100 text-amber-700",
//   Archived: "bg-gray-100 text-gray-700",
// };

// export default function AdminCoursesPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const filteredCourses = mockCourses.filter((course) => {
//     const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === "all" || course.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

//   const totalStudents = mockCourses.reduce((acc, c) => acc + c.students, 0);
//   const totalRevenue = mockCourses.reduce((acc, c) => acc + (c.students * c.price), 0);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Courses Management</h2>
//           <p className="text-sm text-gray-500">Manage all courses on the platform</p>
//         </div>
//         <Link href="/teacher/courses/create">
//           <Button className="bg-indigo-600 hover:bg-indigo-700">
//             <Plus className="h-4 w-4 mr-2" />
//             Create Course
//           </Button>
//         </Link>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="p-4">
//             <p className="text-sm text-gray-500">Total Courses</p>
//             <p className="text-2xl font-bold text-gray-900">{mockCourses.length}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <p className="text-sm text-gray-500">Published</p>
//             <p className="text-2xl font-bold text-emerald-600">
//               {mockCourses.filter(c => c.status === "Published").length}
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <p className="text-sm text-gray-500">Total Students</p>
//             <p className="text-2xl font-bold text-indigo-600">{totalStudents.toLocaleString()}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <p className="text-sm text-gray-500">Revenue</p>
//             <p className="text-2xl font-bold text-emerald-600">${totalRevenue.toFixed(0)}</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
//         <div className="flex flex-wrap items-center gap-4">
//           <div className="flex-1 min-w-50">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search courses..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9"
//               />
//             </div>
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-45">
//               <SelectValue placeholder="All Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="Published">Published</SelectItem>
//               <SelectItem value="Draft">Draft</SelectItem>
//               <SelectItem value="Archived">Archived</SelectItem>
//             </SelectContent>
//           </Select>
//           <div className="text-sm text-gray-500 ml-auto">
//             {filteredCourses.length} courses
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredCourses.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
//                     <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
//                     <p className="text-sm">No courses found</p>
//                     <p className="text-xs text-gray-400">Try adjusting your filters</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCourses.map((course) => (
//                   <tr key={course.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <BookOpen className="h-4 w-4 text-gray-400" />
//                         <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
//                           {course.title}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">{course.instructor}</td>
//                     <td className="px-6 py-4">
//                       <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
//                         {course.category}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-1 text-sm text-gray-600">
//                         <Users className="h-3.5 w-3.5 text-gray-400" />
//                         {course.students}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                       ${course.price}
//                     </td>
//                     <td className="px-6 py-4">
//                       <Badge className={statusColors[course.status as keyof typeof statusColors]}>
//                         {course.status}
//                       </Badge>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon" className="h-8 w-8">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem>
//                             <Eye className="mr-2 h-4 w-4" />
//                             View
//                           </DropdownMenuItem>
//                           <DropdownMenuItem>
//                             <Pencil className="mr-2 h-4 w-4" />
//                             Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem className="text-red-600">
//                             <Trash2 className="mr-2 h-4 w-4" />
//                             Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//             <p className="text-sm text-gray-500">
//               Showing {filteredCourses.length} courses
//             </p>
//             <div className="flex items-center gap-1">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               <span className="text-sm text-gray-600 px-3">
//                 {currentPage} / {totalPages}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






// app/(dashboard)/admin/courses/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

// Mock data - replace with real API data
const mockCourses = [
  {
    id: "1",
    title: "React Masterclass",
    instructor: "John Doe",
    category: "Technology",
    students: 342,
    status: "Published",
    price: 49.99,
    rating: 4.8,
    date: "Jan 15, 2024",
  },
  {
    id: "2",
    title: "Node.js Pro",
    instructor: "Jane Smith",
    category: "Development",
    students: 278,
    status: "Draft",
    price: 39.99,
    rating: 4.7,
    date: "Feb 20, 2024",
  },
  {
    id: "3",
    title: "UI/UX Design",
    instructor: "John Doe",
    category: "Design",
    students: 195,
    status: "Published",
    price: 29.99,
    rating: 4.9,
    date: "Mar 10, 2024",
  },
  {
    id: "4",
    title: "Python for Data Science",
    instructor: "Alex Chen",
    category: "Technology",
    students: 156,
    status: "Archived",
    price: 59.99,
    rating: 4.6,
    date: "Feb 5, 2024",
  },
  {
    id: "5",
    title: "Golang for Pro",
    instructor: "Sarah Lee",
    category: "Development",
    students: 120,
    status: "Published",
    price: 44.99,
    rating: 4.5,
    date: "Jan 28, 2024",
  },
];

const statusColors = {
  Published: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
  Archived: "bg-gray-100 text-gray-700",
};

export default function AdminCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const totalStudents = mockCourses.reduce((acc, c) => acc + c.students, 0);
  const totalRevenue = mockCourses.reduce((acc, c) => acc + (c.students * c.price), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Courses Management</h2>
          <p className="text-sm text-gray-500">Manage all courses on the platform</p>
        </div>
        <Link href="/teacher/courses/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900">{mockCourses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Published</p>
            <p className="text-2xl font-bold text-emerald-600">
              {mockCourses.filter(c => c.status === "Published").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-indigo-600">{totalStudents.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">${totalRevenue.toFixed(0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-500 ml-auto">
            {filteredCourses.length} courses
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm">No courses found</p>
                    <p className="text-xs text-gray-400">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {course.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.instructor}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        {course.students}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${course.price}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusColors[course.status as keyof typeof statusColors]}>
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredCourses.length} courses
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 px-3">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}