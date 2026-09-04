import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { courseId, chapterId } = await params;
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
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: user.id
            }
        });

        if (!courseOwner) {
            return NextResponse.json(
                { error: "You don't own this course" },
                { status: 403 }
            );
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId,
            }
        });

        if (!chapter) {
            return NextResponse.json(
                { error: "Chapter not found" },
                { status: 404 }
            );
        }

        const unpublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            data: {
                isPublished: false,
            },
        });

        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            }
        });

        if (publishedChapters.length === 0) {
            await db.course.update({
                where: {
                    id: courseId,
                    userId: user.id,
                },
                data: {
                    isPublished: false,
                },
            });
        }

        return NextResponse.json(
            { 
                message: "Chapter unpublished successfully",
                chapter: unpublishedChapter
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("[CHAPTER_UNPUBLISH]", error);
        return NextResponse.json(
            { error: "Failed to unpublish chapter" },
            { status: 500 }
        );
    }
}