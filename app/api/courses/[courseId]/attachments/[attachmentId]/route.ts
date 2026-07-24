import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ attachmentId: string; courseId: string }> },
) {
  const { attachmentId, courseId } = await params;
  const { userId } = await auth()

  try {
    if (!attachmentId) {
      return NextResponse.json(
        { error: "Attachment ID is required" },
        { status: 400 },
      );
    }

    if (!userId) {
        return new NextResponse("Unauthorized- No userId found", {status: 401})
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 },
      );
    }

    const courseOwner = await db.course.findUnique({
        where: {
            id: courseId,
            userId: userId
        }
    })

    if (!courseOwner) {
        return new NextResponse("User not found or User do not own course to have course access")
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
            courseId: courseId
        }
    })
    return NextResponse.json({ message: "Attachment deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete attachment" },
      { status: 500 },
    );
  }
}
