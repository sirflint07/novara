// // app/(dashboard)/admin/users/[userId]/edit/UserEditClient.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   User,
//   Mail,
//   Calendar,
//   Shield,
//   BookOpen,
//   FileText,
//   DollarSign,
//   MessageSquare,
//   Heart,
//   Globe,
//   MapPin,
//   Briefcase,
//   GraduationCap,
//   CreditCard,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Edit2,
//   Save,
//   ArrowLeft,
//   Trash2,
//   MoreVertical,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// interface UserEditClientProps {
//   user: any;
//   stats: {
//     totalComments: number;
//     totalLikes: number;
//     totalCoursesCreated: number;
//     totalCoursesEnrolled: number;
//     totalBlogPosts: number;
//     totalRevenue: number;
//     totalSpent: number;
//   };

//   adminActions: Array<{   // ← ADD THIS TOO (if not already there)
//     id: string;
//     action: string;
//     details: any;
//     createdAt: Date;
//     admin: {
//       id: string;
//       name: string | null;
//       email: string;
//     };
//   }>;
// }

// export default function UserEditClient({ user, stats, adminActions, }: UserEditClientProps) {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [role, setRole] = useState(user.role);
//   const [formData, setFormData] = useState({
//     name: user.name || "",
//     email: user.email || "",
//     bio: user.profile?.bio || "",
//     location: user.profile?.location || "",
//     website: user.profile?.website || "",
//     skills: user.profile?.skills?.join(", ") || "",
//     interests: user.profile?.interests?.join(", ") || "",
//   });

//   const handleSave = async () => {
//     setIsSaving(true);
//     try {
//       const response = await fetch(`/api/admin/users/${user.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           role,
//           skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
//           interests: formData.interests.split(",").map(s => s.trim()).filter(Boolean),
//         }),
//       });

//       if (response.ok) {
//         toast.success("User updated successfully");
//         setIsEditing(false);
//         router.refresh();
//       } else {
//         toast.error("Failed to update user");
//       }
//     } catch (error) {
//       toast.error("An error occurred");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleSuspendUser = async () => {
//     try {
//       const response = await fetch(`/api/admin/users/${user.id}/suspend`, {
//         method: "POST",
//       });

//       if (response.ok) {
//         toast.success("User suspended successfully");
//         router.refresh();
//       } else {
//         toast.error("Failed to suspend user");
//       }
//     } catch (error) {
//       toast.error("An error occurred");
//     }
//   };

//   const getInitials = (name: string) => {
//     return name
//       ?.split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase() || "U";
//   };

//   const getStatusBadge = (status: string) => {
//     const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "default" }> = {
//       active: { label: "Active", variant: "success" },
//       suspended: { label: "Suspended", variant: "destructive" },
//       pending: { label: "Pending", variant: "warning" },
//       inactive: { label: "Inactive", variant: "default" },
//     };
//     const config = statusMap[status] || statusMap.inactive;
//     return <Badge variant={config.variant}>{config.label}</Badge>;
//   };

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => router.push("/admin/users")}
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold">User Profile</h1>
//             <p className="text-sm text-muted-foreground">
//               Manage user information and permissions
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           {!isEditing ? (
//             <>
//               <Button variant="outline" onClick={() => setIsEditing(true)}>
//                 <Edit2 className="h-4 w-4 mr-2" />
//                 Edit Profile
//               </Button>
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button variant="destructive">
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Suspend User
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Suspend User Account</DialogTitle>
//                     <DialogDescription>
//                       Are you sure you want to suspend this user's account? This action can be reversed.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <DialogFooter>
//                     <Button variant="outline">Cancel</Button>
//                     <Button variant="destructive" onClick={handleSuspendUser}>
//                       Suspend
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             </>
//           ) : (
//             <>
//               <Button variant="outline" onClick={() => setIsEditing(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSave} disabled={isSaving}>
//                 <Save className="h-4 w-4 mr-2" />
//                 {isSaving ? "Saving..." : "Save Changes"}
//               </Button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* User Overview Card */}
//       <Card>
//         <CardContent className="p-6">
//           <div className="flex flex-col md:flex-row gap-6">
//             <div className="flex items-center gap-4">
//               <Avatar className="h-20 w-20">
//                 <AvatarImage src={user.profile?.avatar} />
//                 <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
//               </Avatar>
//               <div>
//                 {isEditing ? (
//                   <div className="space-y-2">
//                     <Input
//                       placeholder="Full Name"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     />
//                     <Input
//                       placeholder="Email"
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     />
//                   </div>
//                 ) : (
//                   <>
//                     <h2 className="text-xl font-semibold">{user.name}</h2>
//                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                       <Mail className="h-4 w-4" />
//                       {user.email}
//                     </div>
//                     <div className="flex items-center gap-2 mt-2">
//                       <Badge variant="default">{user.role}</Badge>
//                       {getStatusBadge(user.status || "active")}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//             <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 ml-0 md:ml-4">
//               <div className="text-center">
//                 <p className="text-2xl font-bold">{stats.totalCoursesCreated}</p>
//                 <p className="text-xs text-muted-foreground">Courses Created</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-2xl font-bold">{stats.totalCoursesEnrolled}</p>
//                 <p className="text-xs text-muted-foreground">Courses Enrolled</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-2xl font-bold">{stats.totalBlogPosts}</p>
//                 <p className="text-xs text-muted-foreground">Blog Posts</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
//                 <p className="text-xs text-muted-foreground">Revenue Generated</p>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Tabs for detailed information */}
//       <Tabs defaultValue="profile" className="w-full">
//         <TabsList className="grid w-full grid-cols-1 md:grid-cols-5">
//           <TabsTrigger value="profile">Profile</TabsTrigger>
//           <TabsTrigger value="courses">Courses</TabsTrigger>
//           <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
//           <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
//           <TabsTrigger value="payments">Payments</TabsTrigger>
//         </TabsList>

//         {/* Profile Tab */}
//         <TabsContent value="profile" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Personal Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {isEditing ? (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>Bio</Label>
//                       <Textarea
//                         placeholder="User bio..."
//                         value={formData.bio}
//                         onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
//                         rows={3}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Location</Label>
//                       <Input
//                         placeholder="Location"
//                         value={formData.location}
//                         onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>Website</Label>
//                       <Input
//                         placeholder="Website URL"
//                         value={formData.website}
//                         onChange={(e) => setFormData({ ...formData, website: e.target.value })}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Role</Label>
//                       <Select value={role} onValueChange={setRole}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select role" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="STUDENT">Student</SelectItem>
//                           <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
//                           <SelectItem value="ADMIN">Admin</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>Skills</Label>
//                       <Input
//                         placeholder="Enter skills separated by commas"
//                         value={formData.skills}
//                         onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Interests</Label>
//                       <Input
//                         placeholder="Enter interests separated by commas"
//                         value={formData.interests}
//                         onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
//                       />
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-3">
//                       <div>
//                         <p className="text-sm text-muted-foreground">Bio</p>
//                         <p className="text-sm">{user.profile?.bio || "No bio provided"}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">Location</p>
//                         <p className="text-sm flex items-center gap-2">
//                           <MapPin className="h-4 w-4" />
//                           {user.profile?.location || "Not specified"}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="space-y-3">
//                       <div>
//                         <p className="text-sm text-muted-foreground">Website</p>
//                         <p className="text-sm">
//                           {user.profile?.website ? (
//                             <a href={user.profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
//                               <Globe className="h-4 w-4 inline mr-1" />
//                               {user.profile.website}
//                             </a>
//                           ) : (
//                             "Not specified"
//                           )}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">Member Since</p>
//                         <p className="text-sm flex items-center gap-2">
//                           <Calendar className="h-4 w-4" />
//                           {new Date(user.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <Separator />
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Skills</p>
//                       <div className="flex flex-wrap gap-2 mt-1">
//                         {user.profile?.skills?.length > 0 ? (
//                           user.profile.skills.map((skill: string) => (
//                             <Badge key={skill} variant="secondary">{skill}</Badge>
//                           ))
//                         ) : (
//                           <p className="text-sm text-muted-foreground">No skills listed</p>
//                         )}
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">Interests</p>
//                       <div className="flex flex-wrap gap-2 mt-1">
//                         {user.profile?.interests?.length > 0 ? (
//                           user.profile.interests.map((interest: string) => (
//                             <Badge key={interest} variant="outline">{interest}</Badge>
//                           ))
//                         ) : (
//                           <p className="text-sm text-muted-foreground">No interests listed</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <GraduationCap className="h-4 w-4" />
//                     <span>Role: <strong>{user.role}</strong></span>
//                     <Separator orientation="vertical" className="h-4" />
//                     <Clock className="h-4 w-4" />
//                     <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Courses Tab */}
//         <TabsContent value="courses" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Courses {user.role === "INSTRUCTOR" ? "Created" : "Enrolled In"}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {user.role === "INSTRUCTOR" ? (
//                 // Instructor - Show created courses
//                 <div className="space-y-4">
//                   {user.createdCourses.length > 0 ? (
//                     user.createdCourses.map((course: any) => (
//                       <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
//                         <div>
//                           <p className="font-medium">{course.title}</p>
//                           <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                             <span>${course.price || 0}</span>
//                             <span>{course._count.enrollments} students</span>
//                             <span>{course._count.chapters} chapters</span>
//                             <Badge variant={course.isPublished ? "success" : "warning"}>
//                               {course.isPublished ? "Published" : "Draft"}
//                             </Badge>
//                           </div>
//                         </div>
//                         <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/courses/${course.id}`)}>
//                           View
//                         </Button>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-muted-foreground">No courses created yet</p>
//                   )}
//                 </div>
//               ) : (
//                 // Student - Show enrolled courses
//                 <div className="space-y-4">
//                   {user.enrolledCourses.length > 0 ? (
//                     user.enrolledCourses.map((enrollment: any) => (
//                       <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
//                         <div>
//                           <p className="font-medium">{enrollment.course.title}</p>
//                           <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                             <span>Instructor: {enrollment.course.instructor.name}</span>
//                             <span>Progress: {enrollment.progress}%</span>
//                             <Badge variant={enrollment.completed ? "success" : "default"}>
//                               {enrollment.completed ? "Completed" : "In Progress"}
//                             </Badge>
//                           </div>
//                         </div>
//                         <Button variant="ghost" size="sm" onClick={() => router.push(`/courses/${enrollment.course.id}`)}>
//                           View
//                         </Button>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-muted-foreground">No courses enrolled yet</p>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Blogs Tab */}
//         <TabsContent value="blogs" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Blog Posts</CardTitle>
//               <p className="text-sm text-muted-foreground">
//                 Total Posts: {stats.totalBlogPosts} | 
//                 Total Comments: {stats.totalComments} | 
//                 Total Likes: {stats.totalLikes}
//               </p>
//             </CardHeader>
//             <CardContent>
//               {user.blogPosts.length > 0 ? (
//                 <div className="space-y-4">
//                   {user.blogPosts.map((post: any) => (
//                     <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
//                       <div>
//                         <p className="font-medium">{post.title}</p>
//                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                           <span className="flex items-center gap-1">
//                             <MessageSquare className="h-3 w-3" />
//                             {post._count.comments}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Heart className="h-3 w-3" />
//                             {post._count.likes}
//                           </span>
//                           <span>{new Date(post.createdAt).toLocaleDateString()}</span>
//                           <Badge variant={post.published ? "success" : "warning"}>
//                             {post.published ? "Published" : "Draft"}
//                           </Badge>
//                         </div>
//                       </div>
//                       <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/blogs/${post.id}`)}>
//                         View
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-muted-foreground">No blog posts created yet</p>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Subscriptions Tab */}
//         <TabsContent value="subscriptions" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Subscriptions</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {user.subscriptions?.length > 0 ? (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Plan</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Start Date</TableHead>
//                       <TableHead>End Date</TableHead>
//                       <TableHead>Auto Renew</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {user.subscriptions.map((sub: any) => (
//                       <TableRow key={sub.id}>
//                         <TableCell className="font-medium">{sub.plan}</TableCell>
//                         <TableCell>
//                           <Badge variant={sub.status === "active" ? "success" : "destructive"}>
//                             {sub.status}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>{new Date(sub.startDate).toLocaleDateString()}</TableCell>
//                         <TableCell>{new Date(sub.endDate).toLocaleDateString()}</TableCell>
//                         <TableCell>
//                           {sub.autoRenew ? (
//                             <CheckCircle className="h-4 w-4 text-green-500" />
//                           ) : (
//                             <XCircle className="h-4 w-4 text-red-500" />
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <p className="text-muted-foreground">No active subscriptions</p>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Payments Tab */}
//         <TabsContent value="payments" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Payment History</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {user.payments?.length > 0 ? (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Method</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {user.payments.map((payment: any) => (
//                       <TableRow key={payment.id}>
//                         <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
//                         <TableCell>${payment.amount.toFixed(2)}</TableCell>
//                         <TableCell>
//                           <Badge variant={payment.status === "completed" ? "success" : "warning"}>
//                             {payment.status}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>{payment.method}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <p className="text-muted-foreground">No payment history</p>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }



// app/(dashboard)/(routes)/(admin)/admin/users/[userId]/edit/_components/user-edit-client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Calendar,
  BookOpen,
  FileText,
  DollarSign,
  MessageSquare,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  ArrowLeft,
  Ban,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Eye,
  ShoppingBag,
  Award,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface UserEditClientProps {
  user: any;
  stats: {
    totalComments: number;
    totalLikes: number;
    totalCoursesCreated: number;
    totalCoursesEnrolled: number;
    totalBlogPosts: number;
    totalRevenue: number;
    totalSpent: number;
  };
  adminActions: Array<{
    id: string;
    action: string;
    details: any;
    createdAt: Date;
    admin: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
}

export default function UserEditClient({
  user,
  stats,
  adminActions,
}: UserEditClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [role, setRole] = useState(user.role || "STUDENT");
  const [status, setStatus] = useState(user.status || "ACTIVE");
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    avatarUrl: user.avatarUrl || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role,
          status,
        }),
      });

      if (response.ok) {
        toast.success("User updated successfully");
        setIsEditing(false);
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update user");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (
    newStatus: "ACTIVE" | "SUSPENDED" | "BANNED"
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`User ${newStatus.toLowerCase()} successfully`);
        setStatus(newStatus);
        router.refresh();
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const getInitials = (name: string | null) => {
    return (
      name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const getRoleBadge = (userRole: string) => {
    const roleMap: Record<string, { label: string; variant: BadgeVariant }> = {
      ADMIN: { label: "Admin", variant: "destructive" },
      INSTRUCTOR: { label: "Instructor", variant: "default" },
      STUDENT: { label: "Student", variant: "secondary" },
    };
    const config = roleMap[userRole] || roleMap.STUDENT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (userStatus: string) => {
    const statusMap: Record<
      string,
      { label: string; variant: BadgeVariant }
    > = {
      ACTIVE: { label: "Active", variant: "default" },
      SUSPENDED: { label: "Suspended", variant: "destructive" },
      BANNED: { label: "Banned", variant: "destructive" },
    };
    const config = statusMap[userStatus] || statusMap.ACTIVE;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getActionBadge = (action: string) => {
    const actionMap: Record<
      string,
      { label: string; variant: BadgeVariant }
    > = {
      USER_SUSPENDED: { label: "Suspended", variant: "destructive" },
      USER_BANNED: { label: "Banned", variant: "destructive" },
      USER_UNSUSPENDED: { label: "Activated", variant: "default" },
      ROLE_CHANGED: { label: "Role Changed", variant: "secondary" },
      PROFILE_UPDATED: { label: "Profile Updated", variant: "outline" },
    };
    const config = actionMap[action] || {
      label: action.replace(/_/g, " "),
      variant: "outline" as BadgeVariant,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/users")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">User Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage user information and permissions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>

              {status !== "SUSPENDED" && status !== "BANNED" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Suspend User Account</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to suspend{" "}
                        <strong>{user.name || user.email}</strong>? They will
                        lose access until reactivated.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleStatusChange("SUSPENDED")}
                      >
                        Suspend
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {status !== "BANNED" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Ban className="h-4 w-4 mr-2" />
                      Ban User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ban User Account</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to permanently ban{" "}
                        <strong>{user.name || user.email}</strong>?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleStatusChange("BANNED")}
                      >
                        Ban
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {(status === "SUSPENDED" || status === "BANNED") && (
                <Button
                  variant="default"
                  onClick={() => handleStatusChange("ACTIVE")}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Reactivate
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* User Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">
                      {user.name || "Unnamed User"}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserIcon className="h-4 w-4" />
                      @{user.username || "no-username"}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {getRoleBadge(user.role || "STUDENT")}
                      {getStatusBadge(status)}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 ml-0 md:ml-4">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {stats.totalCoursesCreated}
                </p>
                <p className="text-xs text-muted-foreground">
                  Courses Created
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {stats.totalCoursesEnrolled}
                </p>
                <p className="text-xs text-muted-foreground">
                  Courses Enrolled
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.totalBlogPosts}</p>
                <p className="text-xs text-muted-foreground">Blog Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Revenue Generated
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="admin-actions">Admin Log</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        placeholder="Full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        placeholder="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Avatar URL</Label>
                      <Input
                        placeholder="https://..."
                        value={formData.avatarUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            avatarUrl: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STUDENT">Student</SelectItem>
                          <SelectItem value="INSTRUCTOR">
                            Instructor
                          </SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="SUSPENDED">Suspended</SelectItem>
                          <SelectItem value="BANNED">Banned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Full Name
                        </p>
                        <p className="text-sm font-medium">
                          {user.name || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Username
                        </p>
                        <p className="text-sm font-medium">
                          @{user.username || "Not set"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <div className="mt-1">
                          {getRoleBadge(user.role || "STUDENT")}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="mt-1">{getStatusBadge(status)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Onboarding
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {user.onboardingCompleted ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Completed</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Joined</p>
                        <p className="text-sm font-medium">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Last Active
                        </p>
                        <p className="text-sm font-medium">
                          {formatDateTime(
                            user.userAnalytics?.lastActiveAt
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Time Spent
                        </p>
                        <p className="text-sm font-medium">
                          {user.userAnalytics?.totalTimeSpent
                            ? `${Math.floor(
                                user.userAnalytics.totalTimeSpent / 60
                              )}h ${user.userAnalytics.totalTimeSpent % 60}m`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Privacy & Notification Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Profile Visibility
                  </span>
                  <span className="font-medium">
                    {user.privacySettings?.profileVisibility || "public"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Show Enrolled Courses
                  </span>
                  <span className="font-medium">
                    {user.privacySettings?.showEnrolledCourses ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Show Activity Status
                  </span>
                  <span className="font-medium">
                    {user.privacySettings?.showActivityStatus ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Allow Data Export
                  </span>
                  <span className="font-medium">
                    {user.privacySettings?.allowDataExport ? "Yes" : "No"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Course Updates
                  </span>
                  <span className="font-medium">
                    {user.notificationSettings?.courseUpdates ? "On" : "Off"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Messages</span>
                  <span className="font-medium">
                    {user.notificationSettings?.messages ? "On" : "Off"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comments</span>
                  <span className="font-medium">
                    {user.notificationSettings?.comments ? "On" : "Off"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marketing</span>
                  <span className="font-medium">
                    {user.notificationSettings?.marketing ? "On" : "Off"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Courses Created ({stats.totalCoursesCreated})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.courses?.length > 0 ? (
                <div className="space-y-4">
                  {user.courses.map((course: any) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{course.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>${course.price || 0}</span>
                          <span>{course._count.enrollments} students</span>
                          <span>{course._count.chapters} chapters</span>
                          <Badge
                            variant={
                              course.isPublished ? "default" : "outline"
                            }
                          >
                            {course.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <span className="text-xs">
                            Created {formatDate(course.createdAt)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/courses/${course.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No courses created yet
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Courses Enrolled ({stats.totalCoursesEnrolled})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.enrollments?.length > 0 ? (
                <div className="space-y-4">
                  {user.enrollments.map((enrollment: any) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {enrollment.course.title}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>
                            Instructor: {enrollment.course.user?.name || "N/A"}
                          </span>
                          <span>
                            Progress: {enrollment.progressPercentage}%
                          </span>
                          <Badge
                            variant={
                              enrollment.status === "COMPLETED"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {enrollment.status}
                          </Badge>
                          <span className="text-xs">
                            Enrolled {formatDate(enrollment.enrolledAt)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/admin/courses/${enrollment.course.id}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No courses enrolled yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blogs Tab */}
        <TabsContent value="blogs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Blog Posts Created ({stats.totalBlogPosts})
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Total Comments: {stats.totalComments} | Total Likes:{" "}
                {stats.totalLikes}
              </p>
            </CardHeader>
            <CardContent>
              {user.blogPosts?.length > 0 ? (
                <div className="space-y-4">
                  {user.blogPosts.map((post: any) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{post.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post._count.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post._count.likes}
                          </span>
                          <span>{formatDate(post.createdAt)}</span>
                          <Badge
                            variant={
                              post.isPublished ? "default" : "outline"
                            }
                          >
                            {post.isPublished ? "Published" : post.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/blogs/${post.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No blog posts created yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchases Tab */}
        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Purchase History
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Total Spent: ${stats.totalSpent.toFixed(2)}
              </p>
            </CardHeader>
            <CardContent>
              {user.purchases?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.purchases.map((purchase: any) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">
                          {purchase.course.title}
                        </TableCell>
                        <TableCell>
                          ${purchase.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {formatDate(purchase.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No purchases yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Courses Started
                    </p>
                    <p className="text-2xl font-bold">
                      {user.userAnalytics?.coursesStarted || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Courses Completed
                    </p>
                    <p className="text-2xl font-bold">
                      {user.userAnalytics?.coursesCompleted || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Comments Made
                    </p>
                    <p className="text-2xl font-bold">
                      {user.userAnalytics?.totalComments || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Heart className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Likes Given
                    </p>
                    <p className="text-2xl font-bold">
                      {user.userAnalytics?.totalLikes || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Additional Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Blog Views</span>
                <span className="font-medium">
                  {user.userAnalytics?.totalBlogViews || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Active</span>
                <span className="font-medium">
                  {formatDateTime(user.userAnalytics?.lastActiveAt)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Total Time Spent
                </span>
                <span className="font-medium">
                  {user.userAnalytics?.totalTimeSpent
                    ? `${Math.floor(
                        user.userAnalytics.totalTimeSpent / 60
                      )}h ${user.userAnalytics.totalTimeSpent % 60}m`
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Actions Tab */}
        <TabsContent value="admin-actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Admin Action History
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Actions performed on this user's account
              </p>
            </CardHeader>
            <CardContent>
              {adminActions?.length > 0 ? (
                <div className="space-y-3">
                  {adminActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-start justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getActionBadge(action.action)}
                          <span className="text-xs text-muted-foreground">
                            by {action.admin.name || action.admin.email}
                          </span>
                        </div>
                        {action.details &&
                          Object.keys(action.details).length > 0 && (
                            <p className="text-xs text-muted-foreground mt-2 break-all">
                              {JSON.stringify(action.details)}
                            </p>
                          )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {formatDateTime(action.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No admin actions recorded
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}