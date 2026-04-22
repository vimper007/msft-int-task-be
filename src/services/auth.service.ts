import { Prisma } from "@prisma/client";

import { ApiError } from "../errors/api-error";
import { prisma } from "../prisma/client";
import { signToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import { LoginInput, SignupInput } from "../validators/auth.validator";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export async function signup(input: SignupInput): Promise<{
  token: string;
  user: Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;
}> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: publicUserSelect,
  });

  const token = signToken({ id: user.id, email: user.email });

  return { token, user };
}

export async function login(input: LoginInput): Promise<{
  token: string;
  user: Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;
}> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await comparePassword(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ id: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
}

export async function getCurrentUser(userId: string): Promise<
  Prisma.UserGetPayload<{ select: typeof publicUserSelect }>
> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}
