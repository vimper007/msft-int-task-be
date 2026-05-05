import { Prisma } from "@prisma/client";

import { ApiError } from "../errors/api-error";
import { prisma } from "../prisma/client";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export async function getUserById(
  id: string
): Promise<Prisma.UserGetPayload<{ select: typeof publicUserSelect }>> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}
