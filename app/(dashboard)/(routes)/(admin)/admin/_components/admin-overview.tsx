// app/(dashboard)/admin/AdminOverviewClient.tsx
"use client";

import { useState, useEffect } from "react";
import { Users, BookOpen, FileText, DollarSign } from "lucide-react";
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
import { toast } from "sonner";
import { StatsCards } from "./stats-card";
import { ActivityFeed } from "./activity-feed";



// Mock data for activity - replace with real data from API
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

interface AdminOverviewClientProps {
  initialStats: {
    totalUsers: number;
    totalCourses: number;
    totalBlogs: number;
    totalRevenue: number;
  };
  userRole: string;
}

export default function AdminOverviewClient({ 
  initialStats, 
  userRole 
}: AdminOverviewClientProps) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      
      setStats({
        totalUsers: data.stats?.totalUsers || 0,
        totalCourses: data.stats?.totalCourses || 0,
        totalBlogs: data.stats?.totalBlogs || 0,
        totalRevenue: data.stats?.totalRevenue || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const formattedStats = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: 0,
      icon: <Users className="h-5 w-5" />,
      trend: "up" as const,
    },
    {
      label: "Total Courses",
      value: stats.totalCourses.toLocaleString(),
      change: 0,
      icon: <BookOpen className="h-5 w-5" />,
      trend: "up" as const,
    },
    {
      label: "Total Blogs",
      value: stats.totalBlogs.toLocaleString(),
      change: 0,
      icon: <FileText className="h-5 w-5" />,
      trend: "up" as const,
    },
    {
      label: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: 0,
      icon: <DollarSign className="h-5 w-5" />,
      trend: "up" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-500">
            Welcome back, Admin! Here's what's happening on Novara today.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchStats}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={formattedStats} />

      {/* Charts */}
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
              <div className="h-64 flex items-center justify-center text-gray-500">
                Chart will display real user growth data
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
              <div className="h-64 flex items-center justify-center text-gray-500">
                Chart will display real course growth data
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
              <div className="h-64 flex items-center justify-center text-gray-500">
                Chart will display real revenue data
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
              <div className="flex items-center justify-center text-gray-500 h-32">
                Top courses will display here
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <ActivityFeed activities={mockActivities} />
      </div>
    </div>
  );
}