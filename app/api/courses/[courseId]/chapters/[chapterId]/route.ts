import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, videoUrl, isPublished, isFree } = await req.json()

    
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    })

    if (!courseOwner) {
      return NextResponse.json(
        { error: "You don't own this course" },
        { status: 401 }
      )
    }

    
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl
    if (isPublished !== undefined) updateData.isPublished = isPublished
    if (isFree !== undefined) updateData.isFree = isFree

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: updateData,
    })

    return NextResponse.json(chapter, { status: 200 })
  } catch (error) {
    console.error("[CHAPTER_PATCH]", error)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    )
  }
}