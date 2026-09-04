import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Mux from "@mux/mux-node"


export async function DELETE(req: Request,
    { params }: { params:  Promise<{ courseId: string}>}) {
        try {
            const { courseId } = await params
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
                return NextResponse.json("Course ID is required", { status: 400 })
            }

            if (!user.id) {
                return NextResponse.json("Unauthorized - User not found", { status: 401})
            }

            const courseOwner =  await db.course.findUnique({
                where: {
                    id: courseId,
                    userId: user.id
                    }
                })

            if (!courseOwner) {
                return new NextResponse("User not found for selected course", {status: 400})
            }

            const course = await db.course.findUnique({
                where: {
                    id: courseId,
                    userId: user.id
                },
                include: {
                    chapters: {
                        include: {
                            muxData: true
                        }
                    }
                }
            })

            if (!course) {
                return new NextResponse("Course not found or has been deleted", {status: 401})
            }
        } catch (error) {
            console.log("COURSE DELETION- Internal Server Error")
            return new NextResponse("Error - Could not delete course", { status: 500 })
        }
}


export async function POST(req: Request,
    { params }: { params:  Promise<{ courseId: string}> }
) {
    const { courseId } = await params
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

   try {
    if (!courseId) {
        return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    if (!user.id) {
        return NextResponse.json({error: "Unauthorized - User not found"}, { status: 401})
    }
    
     const { url, filename, name } = await req.json()

    if (!url) {
        return new NextResponse("Attachment URL is required", { status: 400 })
    }

    if (!filename) {
        return new NextResponse("Attachment file name is required", { status: 400 })
    }

    const courseOwner =  await db.course.findUnique({
        where: {
            id: courseId,
            userId: user.id
        }
    })

    if (!courseOwner) {
        return new NextResponse("User not found for selected course", {status: 400})
    }

    const attachmentName = filename || name || url.split("/").pop() || "attachment"

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