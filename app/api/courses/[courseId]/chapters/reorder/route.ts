import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { chapters } = await req.json();

    const updatePromises = chapters.map((chapter: { id: string; position: number }) =>
      db.chapter.update({
        where: { id: chapter.id },
        data: { position: chapter.position },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[CHAPTERS_REORDER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}