import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const { userId } = await auth();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      );
    }

    
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
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

    const requiredFields = [
      course.title,
      course.description,
      course.imageUrl,
      course.price,
      course.categoryId,
    ];

    const hasAllRequiredFields = requiredFields.every(Boolean);

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missing: missingFields,
          details: requiredFields,
        },
        { status: 400 }
      );
    }

    if (!hasAllRequiredFields) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missing: {
            title: !course.title,
            description: !course.description,
            imageUrl: !course.imageUrl,
            price: !course.price,
            categoryId: !course.categoryId,
          },
        },
        { status: 400 }
      );
    }

    if (course.chapters.length === 0) {
      return NextResponse.json(
        { error: "Course must have at least one chapter" },
        { status: 400 }
      );
    }

    const hasPublishedChapters = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (!hasPublishedChapters) {
      return NextResponse.json(
        { error: "At least one chapter must be published" },
        { status: 400 }
      );
    }

    const chaptersWithoutVideo = course.chapters
      .filter((chapter) => !chapter.videoUrl)
      .map((chapter) => chapter.title);

    if (chaptersWithoutVideo.length === course.chapters.length) {
      return NextResponse.json(
        {
          error: "All chapters must have a video",
          chaptersWithoutVideo,
        },
        { status: 400 }
      );
    }

    const aChaptersHaveVideo = course.chapters.some(
      (chapter) => chapter.videoUrl
    );

    if (!aChaptersHaveVideo) {
      return NextResponse.json(
        { error: "All chapters must have a video" },
        { status: 400 }
      );
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId: userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(
      {
        message: "Course published successfully",
        course: publishedCourse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[COURSE_PUBLISH]", error);
    return NextResponse.json(
      { error: "Failed to publish course - Check course or chapter fields have been completed" },
      { status: 500 }
    );
  }
}