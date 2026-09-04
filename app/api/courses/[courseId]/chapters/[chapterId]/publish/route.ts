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
            },
            include: {
                muxData: true,
            }
        });

        if (!chapter) {
            return NextResponse.json(
                { error: "Chapter not found" },
                { status: 404 }
            );
        }

        const requiredFields = [
            chapter.title,
            chapter.description,
            chapter.videoUrl,
        ];
        
        const hasAllRequiredFields = requiredFields.every(Boolean);
        
        if (!hasAllRequiredFields) {
            return NextResponse.json(
                { 
                    error: "Missing required fields",
                    missing: {
                        title: !chapter.title,
                        description: !chapter.description,
                        videoUrl: !chapter.videoUrl,
                    }
                },
                { status: 400 }
            );
        }

        const publishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            data: {
                isPublished: true,
            },
        });

        return NextResponse.json(
            { 
                message: "Chapter published successfully",
                chapter: publishedChapter
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("[CHAPTER_PUBLISH]", error);
        return NextResponse.json(
            { error: "Failed to publish chapter" },
            { status: 500 }
        );
    }
}