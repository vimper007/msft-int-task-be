import { Request, Response } from "express";

import { ApiErrorResponse } from "../types/api";

export function notFoundHandler(req: Request, res: Response): void {
  const response: ApiErrorResponse = {
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  };

  res.status(404).json(response);
}
