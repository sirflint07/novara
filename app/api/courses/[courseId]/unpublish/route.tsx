import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const { userId: clerkId } = await auth();
    

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId: clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    if (!user.id) {
      return NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      );
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId: user.id,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(
      {
        message: "Course unpublished successfully",
        course: unpublishedCourse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[COURSE_UNPUBLISH]", error);
    return NextResponse.json(
      { error: "Failed to unpublish course" },
      { status: 500 }
    );
  }
}