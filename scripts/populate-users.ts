import { db } from "../lib/db";

async function populateUsers() {
 
  const courses = await db.course.findMany({
    select: {
      userId: true,
    },
    distinct: ['userId'],
  });

  console.log(`Found ${courses.length} unique users to create`);

  for (const course of courses) {
    const userId = course.userId;
    
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!existingUser) {
      console.log(`Creating user for clerkId: ${userId}`);
      await db.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@placeholder.com`,
          name: `User ${userId.slice(0, 8)}`,
          role: 'INSTRUCTOR',
        },
      });
    }
  }

  console.log('Users populated successfully');
}

populateUsers()
  .catch(console.error)
  .finally(() => db.$disconnect());