import { db } from "@/lib/db"

export const getProgress = async (
    courseId: string,
    userId: string
): Promise<number> => {
    try {
        const publishedChapters = await db.chapter.findMany({
        where: {
            id: userId,
            courseId: courseId
        },
        select: {
            id: true
        }
    })

    const publishedChaptersIds = publishedChapters.map((chapter) => chapter.id)
    const validCompletedChapters = await db.userProgress.count({
        where: {
            userId: userId,
            chapterId: {
                in: publishedChaptersIds
            },
            isCompleted: true
        }
    })

    const progressPercentage = (validCompletedChapters / publishedChapters.length) * 100

    return progressPercentage
    } catch (error) {
        console.log("[GET_PROGRESS], error fetching course progress", error)
        return 0
    }
}