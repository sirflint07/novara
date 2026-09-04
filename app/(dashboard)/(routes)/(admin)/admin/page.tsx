// import { db } from '@/lib/db';
// import { requireAdmin } from '@/lib/admin-check-access';
// import AdminUsersTable from './_components/admin-users-table';

// export default async function AdminPage() {

//   await requireAdmin();

 
//   const dbUsers = await db.user.findMany({
//     orderBy: {
//       createdAt: 'desc',
//     },
//     select: {
//       id: true,
//       email: true,
//       name: true,
//       role: true,
//       createdAt: true,
//       username: true
//     },
//   });

  

//   return (
//     <div className="max-w-[80vw] mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <AdminUsersTable dbUsers={dbUsers} />
//       </div>
//     </div>
//   );
// }






// app/(dashboard)/admin/page.tsx
import { Users, BookOpen, FileText, DollarSign } from "lucide-react";

import { ActivityFeed } from "./_components/activity-feed";
import { StatsCards } from "./_components/stats-card";

// Mock data - replace with real data from API
const mockStats = [
  {
    label: "Total Users",
    value: "1,284",
    change: 12,
    icon: <Users className="h-5 w-5" />,
    trend: "up" as const,
  },
  {
    label: "Total Courses",
    value: "156",
    change: 8,
    icon: <BookOpen className="h-5 w-5" />,
    trend: "up" as const,
  },
  {
    label: "Total Blogs",
    value: "342",
    change: 15,
    icon: <FileText className="h-5 w-5" />,
    trend: "up" as const,
  },
  {
    label: "Revenue",
    value: "$8,432",
    change: 18,
    icon: <DollarSign className="h-5 w-5" />,
    trend: "up" as const,
  },
];

const mockActivities = [
  {
    id: "1",
    type: "user" as const,
    title: "New user registered",
    description: "John Doe joined Novara as a student",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "course" as const,
    title: "New course created",
    description: "React Masterclass by Jane Smith",
    timestamp: "15 minutes ago",
  },
  {
    id: "3",
    type: "blog" as const,
    title: "New blog published",
    description: "10 React Tips by John Doe",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "system" as const,
    title: "System update",
    description: "Platform maintenance scheduled for Sunday",
    timestamp: "3 hours ago",
  },
  {
    id: "5",
    type: "user" as const,
    title: "User upgraded",
    description: "Sarah Lee became an instructor",
    timestamp: "5 hours ago",
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, Admin!</h2>
        <p className="text-gray-500">Here's what's happening on Novara today.</p>
      </div>

      <StatsCards stats={mockStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button className="p-4 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100 transition-colors text-sm font-medium text-center">
                Add New User
              </button>
              <button className="p-4 bg-emerald-50 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors text-sm font-medium text-center">
                Create Course
              </button>
              <button className="p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors text-sm font-medium text-center">
                Write Blog
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Platform Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-indigo-100">Server Status</span>
                <span className="font-medium text-emerald-300">● Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-100">Active Users</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-100">Uptime</span>
                <span className="font-medium">99.9%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-100">Storage</span>
                <span className="font-medium">68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ActivityFeed activities={mockActivities} />
    </div>
  );
}