import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { role } = await req.json();

    if (!["STUDENT", "INSTRUCTOR"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    console.log("Updating role:", {
      userId,
      role,
    });

    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        clerkId: true,
        role: true,
      },
    });

    console.log("Existing database user:", user);

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found in database",
        },
        { status: 404 }
      );
    }

    const updatedUser = await db.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        role,
        onboardingCompleted: true,
      },
      select: {
        id: true,
        clerkId: true,
        role: true,
        onboardingCompleted: true,
      },
    });

    console.log("Role successfully updated:", updatedUser);

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("ROLE UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update role",
      },
      { status: 500 }
    );
  }
}