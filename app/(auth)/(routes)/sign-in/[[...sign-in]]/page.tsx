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


import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SignIn } from "@clerk/nextjs";

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { 
        role: true, 
        onboardingCompleted: true 
      },
    });

    if (!user || !user.onboardingCompleted) {
      redirect("/onboarding/role-selection");
    }

    switch (user.role) {
      case "ADMIN":
        redirect("/admin");
      case "INSTRUCTOR":
        redirect("/teacher/courses");
      case "STUDENT":
        redirect("/");
      default:
        redirect("/onboarding/role-selection");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
}