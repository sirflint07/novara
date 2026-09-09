// "use client";

// import { SignIn, useUser } from "@clerk/nextjs";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect } from "react";

// export default function SignInPage() {
//   const { isSignedIn, isLoaded } = useUser();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const redirectUrl = searchParams.get("redirect_url") || "/admin";

//   useEffect(() => {
//     if (isLoaded && isSignedIn) {
//       router.replace(redirectUrl);
//     }
//   }, [isSignedIn, isLoaded, router, redirectUrl]);

//   if (!isLoaded) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-pulse">Loading...</div>
//       </div>
//     );
//   }

//   if (isSignedIn) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-pulse">Redirecting...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <SignIn />
//     </div>
//   );
// }


// app/(auth)/(routes)/sign-in/[[...sign-in]]/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SignIn } from "@clerk/nextjs";

export default async function SignInPage() {
  const { userId } = await auth();
  
  // If user is already authenticated, handle redirect
  if (userId) {
    // Fetch user from database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { 
        role: true, 
        onboardingCompleted: true 
      },
    });

    // If user doesn't exist or onboarding not completed
    if (!user || !user.onboardingCompleted) {
      redirect("/onboarding/role-selection");
    }

    // Redirect based on role
    switch (user.role) {
      case "ADMIN":
        redirect("/admin");
      case "INSTRUCTOR":
        redirect("/teacher/courses");
      case "STUDENT":
        redirect("/");
      default:
        // Fallback for any other role
        redirect("/onboarding/role-selection");
    }
  }

  // If not authenticated, show sign-in page
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn 
        // Optional: Pass redirect URL from query params
        // The middleware will handle this
      />
    </div>
  );
}