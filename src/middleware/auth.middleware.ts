import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";
import { prisma } from "../prisma/client";
import { verifyToken } from "../utils/jwt";

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new ApiError(401, "Authorization token is missing"));
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      next(new ApiError(401, "Token is valid but user no longer exists"));
      return;
    }

    req.user = user;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}
