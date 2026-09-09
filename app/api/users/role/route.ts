import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        clerkId: true,
        role: true,
        onboardingCompleted: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const { role } = await req.json();

    if (!["STUDENT", "INSTRUCTOR", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be STUDENT, INSTRUCTOR, or ADMIN" },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: {
        clerkId,
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

     const client = await clerkClient();
    await client.users.updateUser(clerkId, {
      publicMetadata: {
        role: role,
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
        error: error instanceof Error ? error.message : "Failed to update role",
      },
      { status: 500 }
    );
  }
}