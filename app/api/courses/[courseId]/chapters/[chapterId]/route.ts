import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { Mux } from "@mux/mux-node"



console.log("MUX_TOKEN_ID exists:", !!process.env.MUX_TOKEN_ID)
console.log("MUX_TOKEN_SECRET exists:", !!process.env.MUX_TOKEN_SECRET)

if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRETY) {
  console.error("MUX_TOKEN_ID and MUX_TOKEN_SECRET must be set in environment variables")
}
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRETY
});

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

    if (videoUrl) {
      const existingMuxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId
        }
      })

      if (existingMuxData) {
        try {
          await mux.video.assets.delete(existingMuxData.assetId)
          
          await db.muxData.delete({
            where: {
              id: existingMuxData.id
            }
          })
        } catch (error) {
          console.error("[MUX_DELETE_ERROR]", error)
          return NextResponse.json(
            { error: "Failed to delete existing video asset in Mux" },
            { status: 500 }
          )
        }
      }
      try {
        const asset = await mux.video.assets.create({
          inputs: [{ url: videoUrl }],
          playback_policy: ['public'],
          video_quality: 'basic',
          test: false
        })
        await db.muxData.create({
          data: {
            chapterId: chapterId,
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0]?.id,
          }
        })
      } catch (error) {
        console.error("[MUX_CREATE_ERROR]", error)
        return NextResponse.json(
          { error: "Failed to create video asset in Mux" },
          { status: 500 }
        )
      }
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
      include: {
        muxData: true,
      },
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