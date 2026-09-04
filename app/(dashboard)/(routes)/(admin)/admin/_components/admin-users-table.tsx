"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import axios from "axios";

interface User {
  id: string;
  clerkId: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: UserRole | null;
  courses: number;
  blogs: number;
  createdAt: Date;
}

interface AdminUsersTableProps {
  users: User[];
}

const getRoleBadgeClass = (role: UserRole | null) => {
  if (!role) return "bg-gray-100 text-gray-700";
  
  const roleMap: Record<UserRole, string> = {
    ADMIN: "bg-purple-100 text-purple-700",
    INSTRUCTOR: "bg-blue-100 text-blue-700",
    STUDENT: "bg-gray-100 text-gray-700",
  };
  
  return roleMap[role] || "bg-gray-100 text-gray-700";
};

const getRoleDisplayName = (role: UserRole | null) => {
  if (!role) return "Unknown";
  
  const roleMap: Record<UserRole, string> = {
    ADMIN: "Admin",
    INSTRUCTOR: "Instructor",
    STUDENT: "Student",
  };
  
  return roleMap[role] || "Unknown";
};

export const AdminUsersTable = ({ users }: AdminUsersTableProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [userList, setUserList] = useState(users);
  
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const itemsPerPage = 10;

  const filteredUsers = userList.filter((user) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const openRoleDialog = (userId: string, newRole: UserRole) => {
    setSelectedUserId(userId);
    setSelectedRole(newRole);
    setRoleDialogOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedUserId || !selectedRole) return;

    setIsLoading(true);
    try {
      await axios.patch(`/api/admin/users/${selectedUserId}/role`, { role: selectedRole });
      
      setUserList(prev =>
        prev.map(user =>
          user.id === selectedUserId ? { ...user, role: selectedRole } : user
        )
      );
      
      toast.success(`User role updated to ${getRoleDisplayName(selectedRole)}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update user role");
      console.error(error);
    } finally {
      setIsLoading(false);
      setRoleDialogOpen(false);
      setSelectedUserId(null);
      setSelectedRole(null);
    }
  };

  const openDeleteDialog = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;

    setIsDeleting(selectedUserId);
    try {
      await axios.delete(`/api/admin/users/${selectedUserId}`);
      setUserList(prev => prev.filter(user => user.id !== selectedUserId));
      toast.success("User deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    } finally {
      setIsDeleting(null);
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  const handleEdit = (userId: string) => {
    router.push(`/admin/users/${userId}/edit`);
  };

  const handleView = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 max-w-sm"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
              <SelectItem value="STUDENT">Student</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-500 ml-auto">
            {filteredUsers.length} users
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blogs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <p className="text-sm">No users found</p>
                    <p className="text-xs text-gray-400">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                          {user.name?.charAt(0) || user.username?.charAt(0) || "?"}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {user.name || user.username || "Unnamed"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.username ? (
                        <span className="font-mono text-xs">@{user.username}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getRoleBadgeClass(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.courses}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.blogs}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="hidden lg:flex items-center gap-1">
                          {user.role !== 'STUDENT' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openRoleDialog(user.id, 'STUDENT')}
                              disabled={isLoading || isDeleting === user.id}
                              className="h-7 text-xs"
                            >
                              Student
                            </Button>
                          )}
                          {user.role !== 'INSTRUCTOR' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openRoleDialog(user.id, 'INSTRUCTOR')}
                              disabled={isLoading || isDeleting === user.id}
                              className="h-7 text-xs"
                            >
                              Instructor
                            </Button>
                          )}
                          {user.role !== 'ADMIN' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openRoleDialog(user.id, 'ADMIN')}
                              disabled={isLoading || isDeleting === user.id}
                              className="h-7 text-xs text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                              Admin
                            </Button>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting === user.id}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(user.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => openDeleteDialog(user.id)}
                              className="text-red-600"
                              disabled={isDeleting === user.id}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
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

      <AlertDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this user's role to <strong>{selectedRole ? getRoleDisplayName(selectedRole) : ''}</strong>?
              <br />
              <br />
              This action will affect what the user can access on the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRoleChange}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user?
              <br />
              <br />
              This action cannot be undone. All associated data (courses, blogs, enrollments) will also be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting !== null ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};