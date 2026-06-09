import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export async function POST(req: Request,
    { params }: { params:  Promise<{ courseId: string}> }
) {
    const { courseId } = await params
    const { userId } = await auth()

   try {
    if (!courseId) {
        return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    if (!userId) {
        return NextResponse.json({error: "Unauthorized - User not found"}, { status: 401})
    }

    const { url, filename } = await req.json()

    if (!url) {
        return new NextResponse("Attachment URL is required", { status: 400 })
    }

    if (!filename) {
        return new NextResponse("Attachment file name is required", { status: 400 })
    }

    const courseOwner =  await db.course.findUnique({
        where: {
            id: courseId,
            userId: userId
        }
    })

    if (!courseOwner) {
        return new NextResponse("User not found for selected course", {status: 400})
    }

    const newAttachment = await db.attachment.create({
        data: {
            url,
            name: url.split("/").pop() || "attachment",
            courseId: courseId,
            fileName: filename,
        }
    })
    
    return NextResponse.json(newAttachment, { status: 201 })
   } catch (error) {
        return NextResponse.json({ error: "Failed to create attachment" }, { status: 500 })
   }
}