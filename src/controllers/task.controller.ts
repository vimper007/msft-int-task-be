import { Request, Response } from "express";

import * as taskService from "../services/task.service";
import { sendSuccess } from "../utils/api-response";
import { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "../validators/task.validator";

export async function getTasks(req: Request, res: Response): Promise<void> {
  const result = await taskService.listTasks(req.user!.id, req.query as unknown as ListTasksQuery);

  sendSuccess(res, 200, "Tasks fetched", result.tasks, result.meta);
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
  const task = await taskService.getTaskById(req.user!.id, req.params.id);

  sendSuccess(res, 200, "Task fetched", task);
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const task = await taskService.createTask(req.user!.id, req.body as CreateTaskInput);

  sendSuccess(res, 201, "Task created", task);
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const task = await taskService.updateTask(req.user!.id, req.params.id, req.body as UpdateTaskInput);

  sendSuccess(res, 200, "Task updated", task);
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  await taskService.deleteTask(req.user!.id, req.params.id);

  sendSuccess(res, 200, "Task deleted");
}
