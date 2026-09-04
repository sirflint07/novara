import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import Mux from "@mux/mux-node"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
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

        const mux = new Mux({
            tokenId: process.env.MUX_TOKEN_ID,
            tokenSecret: process.env.MUX_TOKEN_SECRET,
        });

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: user.id,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                },
            },
        });

        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                try {
                    await mux.video.assets.delete(chapter.muxData.assetId);
                } catch (error) {
                    console.error(`Failed to delete Mux asset: ${error}`);
                }
            }
        }

        await db.course.delete({
            where: {
                id: courseId,
                userId: user.id,
            },
        });

        return NextResponse.json(
            { message: "Course deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("[COURSE_DELETE]", error);
        return NextResponse.json(
            { error: "Failed to delete course" },
            { status: 500 }
        );
    }
}


export async function PATCH (req: Request,
    {params}: {params: Promise<{ courseId: string }>}
) {
    const {courseId} = await params
    try {
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
         console.log("Route - Course ID:", courseId)
         console.log("Route - User ID from Clerk:", user.id)

        if (!user.id) {
            return new Response('Unauthorized', { status: 401 })
        }
        const values = await req.json()

        console.log("Route - Update Values:", values)

       const course = await db.course.update({
        where: {
            id: courseId,
            userId: user.id
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

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
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

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: user.id,
            },
            include: {
                chapters: {
                    orderBy: { position: "asc" },
                },
                attachments: true,
            },
        });

        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(course, { status: 200 });

    } catch (error) {
        console.error("[COURSE_GET]", error);
        return NextResponse.json(
            { error: "Failed to fetch course" },
            { status: 500 }
        );
    }
}