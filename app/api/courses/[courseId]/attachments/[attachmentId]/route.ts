import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ attachmentId: string; courseId: string }> },
) {
  const { attachmentId, courseId } = await params;

  try {
    if (!attachmentId) {
      return NextResponse.json(
        { error: "Attachment ID is required" },
        { status: 400 },
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 },
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
