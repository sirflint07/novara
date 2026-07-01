import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(
    req: Request, 
    { params }: { params: Promise<{ courseId: string }> }) 
{
    try {
        const {courseId} = await params
        const {userId} = await auth()

        if (!courseId) {
            return new NextResponse("Course ID is required- Course not found", {status: 400})
        }

        if (!userId) {
            return new NextResponse("Unauthorized- No userId found", {status: 401})
        }
        const {title} = await req.json()
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized- User do not own course to have chapter access", {status: 401})
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: courseId
            },
            orderBy: {
                position: "desc"
            }
        })

        const newPosition = lastChapter ? lastChapter.position + 1 : 1

        const newChapter = await db.chapter.create({
            data: {
                title,
                courseId: (await params).courseId,
                position: newPosition
            }
        })

        return NextResponse.json(newChapter)
    } catch (error) {
        return new NextResponse("Failed to create chapter", { status: 500 })
    }

}