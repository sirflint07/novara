import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH (req: Request,
    {params}: {params: Promise<{ courseId: string }>}
) {
    const {courseId} = await params
    try {
        const { userId } = await auth()
         console.log("Route - Course ID:", courseId)
         console.log("Route - User ID from Clerk:", userId)

        if (!userId) {
            return new Response('Unauthorized', { status: 401 })
        }
        const values = await req.json()

        console.log("Route - Update Values:", values)

       const course = await db.course.update({
        where: {
            id: courseId,
            userId
        }, data: {
            ...values
        }
       })
       return NextResponse.json(course, {status: 200})
        
    } catch (error: any) {
        console.log(`[COURSEID]- Error in the CourseId Route, ${error.message}`)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}