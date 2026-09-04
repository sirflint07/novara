import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; attachmentId: string }> }
) {
  try {
    const { courseId, attachmentId } = await params;
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

    if (!user.id) {
      return NextResponse.json(
        { error: "Unauthorized - No userId found" },
        { status: 401 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    if (!attachmentId) {
      return NextResponse.json(
        { error: "Attachment ID is required" },
        { status: 400 }
      );
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!courseOwner) {
      return NextResponse.json(
        { error: "User not found or User does not own this course" },
        { status: 403 }
      );
    }

    const attachment = await db.attachment.findUnique({
      where: {
        id: attachmentId,
        courseId: courseId,
      },
    });

    if (!attachment) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 }
      );
    }

    await db.attachment.delete({
      where: {
        id: attachmentId,
        courseId: courseId,
      },
    });

    return NextResponse.json(
      { message: "Attachment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ATTACHMENT_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete attachment" },
      { status: 500 }
    );
  }
}