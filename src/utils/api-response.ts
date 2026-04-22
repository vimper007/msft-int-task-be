import { Request, Response } from "express";

import { ApiSuccessResponse } from "../types/api";

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: object,
): Response<ApiSuccessResponse<T>> {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
}

export function sendHealth(res: Response): Response {
  return sendSuccess(
    res,
    200,
    "Task Manager backend is running",
    {
      timestamp: new Date().toISOString(),
    },
  );
}
