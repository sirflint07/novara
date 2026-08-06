import { Course, Category } from "@prisma/client";
import { db } from "./db";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
    isPurchased: boolean;
    completedChapters: number;
};

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
};

export const GetCourses = async ({
    userId,
    title,
    categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                ...(title && {
                    title: {
                        contains: title,
                        mode: "insensitive",
                    },
                }),
                ...(categoryId && { categoryId }),
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                        userProgress: {
                            where: {
                                userId,
                                isCompleted: true,
                            },
                            select: {
                                id: true,
                            },
                        },
                    },
                    orderBy: {
                        position: "asc",
                    },
                },
                purchases: {
                    where: {
                        userId,
                    },
                },
                enrollments: {
                    where: {
                        userId,
                        status: "ACTIVE",
                    },
                },
            },
            orderBy: {
                title: "asc",
            },
        });

        const coursesWithProgress = courses.map((course) => {
            const isPurchased = course.purchases.length > 0;
            const isEnrolled = course.enrollments.length > 0;
            const hasAccess = isPurchased || isEnrolled;

            const totalChapters = course.chapters.length;
            const completedChapters = course.chapters.filter(
                (chapter) => chapter.userProgress.length > 0
            ).length;

            let progress: number | null = null;
            if (hasAccess && totalChapters > 0) {
                progress = Math.round((completedChapters / totalChapters) * 100);
            }

           const chaptersWithoutProgress = course.chapters.map(({ userProgress, ...chapter }) => ({
                ...chapter,
            }));

            return {
                ...course,
                category: course.category,
                chapters: chaptersWithoutProgress,
                progress,
                isPurchased,
                completedChapters,
            };
        });

        return coursesWithProgress;
    } catch (error) {
        console.error("[GET_COURSES]", error);
        return [];
    }
};