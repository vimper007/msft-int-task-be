import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

import { env } from "../config/env";

export interface AuthTokenPayload extends JwtPayload {
  sub: string;
  email: string;
}

export function signToken(user: { id: string; email: string }): string {
  return jwt.sign(
    { email: user.email },
    env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    },
  );
}

export function verifyToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === "string" || !decoded.sub || !decoded.email) {
    throw new Error("Invalid token payload");
  }

  return decoded as AuthTokenPayload;
}
