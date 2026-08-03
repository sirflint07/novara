import { db } from "@/lib/db"

export const getProgress = async (
    courseId: string,
    userId: string
): Promise<{ progress: number; isEnrolled: boolean; totalChapters: number; completedChapters: number }> => {
    try {
        const enrollment = await db.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: userId,
                    courseId: courseId
                }
            }
        })

        const isEnrolled = !!enrollment

        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            },
            select: {
                id: true
            },
            orderBy: {
                position: 'asc'
            }
        })

        const totalChapters = publishedChapters.length

        if (totalChapters === 0) {
            return { progress: 0, isEnrolled, totalChapters: 0, completedChapters: 0 }
        }

        const publishedChapterIds = publishedChapters.map((chapter) => chapter.id)
        
        const completedChapters = await db.userProgress.count({
            where: {
                userId: userId,
                chapterId: {
                    in: publishedChapterIds
                },
                isCompleted: true
            }
        })

        const progress = Math.round((completedChapters / totalChapters) * 100)

        return {
            progress,
            isEnrolled,
            totalChapters,
            completedChapters
        }
    } catch (error) {
        console.error("[GET_PROGRESS] Error fetching course progress:", error)
        return {
            progress: 0,
            isEnrolled: false,
            totalChapters: 0,
            completedChapters: 0
        }
    }
}