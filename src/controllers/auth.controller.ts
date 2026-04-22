import { Request, Response } from "express";

import * as authService from "../services/auth.service";
import { sendSuccess } from "../utils/api-response";
import { LoginInput, SignupInput } from "../validators/auth.validator";

export async function signup(req: Request, res: Response): Promise<void> {
  const result = await authService.signup(req.body as SignupInput);

  sendSuccess(res, 201, "Signup successful", result);
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = await authService.login(req.body as LoginInput);

  sendSuccess(res, 200, "Login successful", result);
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await authService.getCurrentUser(req.user!.id);

  sendSuccess(res, 200, "Current user fetched", user);
}
