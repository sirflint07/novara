import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { toast } from 'sonner'

export async function POST (req: Request) {
    try {
        const { userId } = await auth()
        const { title, description } = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized user - UserId not found", {status: 401})
        }

        const course = await db.course.create({
            data: {
                title,
                description,
                userId
            }
        })
        return NextResponse.json(course, {status: 200})
    } catch (error) {
        console.log(`===========================COURSES============================= \n ${error}`)
        return new NextResponse("Internal Server Error", {status: 501})
    }
}