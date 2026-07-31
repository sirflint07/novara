import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

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



export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "all";
    const status = url.searchParams.get("status") || "all";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {
      userId: userId,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category !== "all") {
      where.categoryId = category;
    }

    if (status === "published") {
      where.isPublished = true;
    } else if (status === "draft") {
      where.isPublished = false;
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const skip = (page - 1) * limit;

    const [courses, totalCount, categories] = await Promise.all([
      db.course.findMany({
        where,
        include: {
          category: true,
          chapters: {
            select: {
              id: true,
              isPublished: true,
            },
          },
        //   enrollments: {
        //     select: {
        //       id: true,
        //     },
        //   },
          attachments: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.course.count({ where }),
      db.category.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    const formattedCourses = courses.map((course) => {
      const totalChapters = course.chapters.length;
      const publishedChapters = course.chapters.filter(
        (ch) => ch.isPublished
      ).length;
      //const totalStudents = course.enrollments.length;

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
        price: course.price,
        isPublished: course.isPublished,
        categoryId: course.categoryId,
        category: course.category,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
        userId: course.userId,
        totalChapters,
        publishedChapters,
        //totalStudents,
        completionPercentage: totalChapters > 0
          ? Math.round((publishedChapters / totalChapters) * 100)
          : 0,
        attachments: course.attachments,
        //enrollments: course.enrollments,
      };
    });

    return NextResponse.json({
      courses: formattedCourses,
      categories: categories,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        totalCourses: totalCount,
        publishedCourses: await db.course.count({
          where: { userId, isPublished: true },
        }),
        // totalStudents: await db.enrollment.count({
        //   where: {
        //     course: {
        //       userId: userId,
        //     },
        //   },
        // }),
      },
    });
  } catch (error) {
    console.error("[TEACHER_COURSES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}