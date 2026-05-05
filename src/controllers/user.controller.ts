import { Request, Response } from "express";

import * as userService from "../services/user.service";
import { sendSuccess } from "../utils/api-response";

export async function getById(req: Request, res: Response): Promise<void> {
  const user = await userService.getUserById(req.params.id);

  sendSuccess(res, 200, "User fetched", user);
}
