"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";

export default function RoleSelectionPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<
    "STUDENT" | "INSTRUCTOR" | null
  >(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

// const handleRoleSelection = async () => {
//   if (!selectedRole || isSubmitting) return;

//   setIsSubmitting(true);

//   try {
//     console.log("Submitting role:", selectedRole);

//     const response = await axios.patch(
//       "/api/users/role",
//       {
//         role: selectedRole,
//       },
//       {
//         timeout: 10000,
//       }
//     );

//     console.log("Role API response:", response.data);

//     if (!response.data.success) {
//       throw new Error(
//         response.data.error || "Failed to update role"
//       );
//     }

//     toast.success("Role selected successfully!");

//     if (selectedRole === "INSTRUCTOR") {
//       window.location.href = "/teacher/courses";
//     } else {
//       window.location.href = "/";
//     }
//   } catch (error: any) {
//     console.error("ROLE SELECTION ERROR:", error);

//     const message =
//       error?.response?.data?.error ||
//       error?.message ||
//       "Failed to update role";

//     toast.error(message);

//     setIsSubmitting(false);
//   }
// };

const handleRoleSelection = async () => {
  if (!selectedRole || isSubmitting) return;

  setIsSubmitting(true);

  try {
    console.log("🚀 Starting role selection...");
    console.log("📤 Selected role:", selectedRole);

    const response = await axios.patch(
      "/api/users/role",
      { role: selectedRole },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("📥 Response status:", response.status);
    console.log("📥 Response data:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update role");
    }

    toast.success("Role selected successfully!");

    if (selectedRole === "INSTRUCTOR") {
      window.location.href = "/teacher/courses";
    } else {
      window.location.href = "/";
    }
  } catch (error: any) {
    console.error("❌ ROLE SELECTION ERROR:", error);
    
    // ✅ Log the full error details
    if (error.response) {
      console.error("📥 Response status:", error.response.status);
      console.error("📥 Response data:", error.response.data);
      console.error("📥 Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("📤 No response received:", error.request);
    } else {
      console.error("💥 Error message:", error.message);
    }

    const message =
      error?.response?.data?.error ||
      error?.message ||
      "Failed to update role";

    toast.error(message);
    setIsSubmitting(false);
  }
};

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-indigo-50/30 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">
            Choose Your Role
          </CardTitle>

          <CardDescription>
            Select how you want to use Novara
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />

            <div className="text-sm text-amber-800">
              <p className="font-medium">
                ⚠️ This choice is permanent
              </p>

              <p className="text-amber-700">
                Once you select a role, you'll need to contact
                an administrator to change it.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* STUDENT */}
            <div
              className={cn(
                "border-2 rounded-xl p-6 cursor-pointer transition-all duration-200",
                selectedRole === "STUDENT"
                  ? "border-indigo-600 bg-indigo-50 shadow-md"
                  : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
              )}
              onClick={() => setSelectedRole("STUDENT")}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className={cn(
                    "h-14 w-14 rounded-full flex items-center justify-center",
                    selectedRole === "STUDENT"
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  <GraduationCap className="h-7 w-7" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Student
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Learn from courses, track your progress,
                    and earn certificates
                  </p>
                </div>

                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                    selectedRole === "STUDENT"
                      ? "border-indigo-600 bg-indigo-600"
                      : "border-gray-300"
                  )}
                >
                  {selectedRole === "STUDENT" && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* INSTRUCTOR */}
            <div
              className={cn(
                "border-2 rounded-xl p-6 cursor-pointer transition-all duration-200",
                selectedRole === "INSTRUCTOR"
                  ? "border-indigo-600 bg-indigo-50 shadow-md"
                  : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
              )}
              onClick={() => setSelectedRole("INSTRUCTOR")}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className={cn(
                    "h-14 w-14 rounded-full flex items-center justify-center",
                    selectedRole === "INSTRUCTOR"
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  <Users className="h-7 w-7" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Instructor
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Create and sell courses, manage students,
                    and earn revenue
                  </p>
                </div>

                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                    selectedRole === "INSTRUCTOR"
                      ? "border-indigo-600 bg-indigo-600"
                      : "border-gray-300"
                  )}
                >
                  {selectedRole === "INSTRUCTOR" && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleRoleSelection}
            disabled={!selectedRole || isSubmitting}
            className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Setting your role...
              </>
            ) : (
              `Continue as ${
                selectedRole?.toLowerCase() || "..."
              }`
            )}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            You can change this later by contacting support
          </p>
        </CardContent>
      </Card>
    </div>
  );
}