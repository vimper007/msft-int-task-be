import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {
      name: "Demo User",
      passwordHash,
    },
    create: {
      name: "Demo User",
      email: "demo@example.com",
      passwordHash,
    },
  });

  await prisma.task.deleteMany({ where: { userId: user.id } });

  await prisma.task.createMany({
    data: [
      {
        title: "Prepare interview notes",
        description: "Review React hooks and TypeScript utility types.",
        status: "todo",
        priority: "high",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        userId: user.id,
      },
      {
        title: "Build portfolio task app",
        description: "Implement authentication and task CRUD UI.",
        status: "in_progress",
        priority: "medium",
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        userId: user.id,
      },
      {
        title: "Practice behavioral questions",
        description: "Prepare concise STAR responses for common prompts.",
        status: "done",
        priority: "low",
        userId: user.id,
      },
    ],
  });

  console.log("Seed complete.");
  console.log("Demo login: demo@example.com / Password123!");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
