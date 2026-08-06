import { db } from "../lib/db";

async function fixOrphanCourses() {
  try {
    const allCourses = await db.course.findMany({
      select: {
        id: true,
        userId: true,
        title: true,
      },
    });

    const courseUserIds = [...new Set(allCourses.map(c => c.userId))];
    
    const existingUsers = await db.user.findMany({
      where: {
        clerkId: {
          in: courseUserIds,
        },
      },
      select: {
        clerkId: true,
      },
    });

    const existingUserIds = new Set(existingUsers.map(u => u.clerkId));

    const orphanCourses = allCourses.filter(
      course => !existingUserIds.has(course.userId)
    );

    console.log(`Found ${orphanCourses.length} orphan courses`);

    if (orphanCourses.length === 0) {
      console.log('No orphan courses found!');
      return;
    }

    const uniqueUserIds = [...new Set(orphanCourses.map(c => c.userId))];
    console.log(`Creating ${uniqueUserIds.length} missing users...`);

    for (const userId of uniqueUserIds) {
      const existingUser = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!existingUser) {
        await db.user.create({
          data: {
            clerkId: userId,
            email: `user_${userId.slice(0, 12)}@placeholder.com`,
            name: `User ${userId.slice(0, 8)}`,
            role: 'INSTRUCTOR',
          },
        });
        console.log(`Created user: ${userId}`);
      }
    }

    const allCoursesAfter = await db.course.findMany({
      select: {
        id: true,
        userId: true,
      },
    });

    const usersAfter = await db.user.findMany({
      select: {
        clerkId: true,
      },
    });

    const existingUserIdsAfter = new Set(usersAfter.map(u => u.clerkId));
    const remainingOrphans = allCoursesAfter.filter(
      course => !existingUserIdsAfter.has(course.userId)
    );

    if (remainingOrphans.length === 0) {
      console.log('All orphan courses fixed!');
    } else {
      console.log(`Still have ${remainingOrphans.length} orphan courses`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.$disconnect();
  }
}

fixOrphanCourses();