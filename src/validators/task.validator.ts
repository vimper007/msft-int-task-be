import { z } from "zod";

const emptyStringToUndefined = (value: unknown): unknown => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
};

export const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);
export const taskPrioritySchema = z.enum(["low", "medium", "high"]);

export const createTaskBodySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  status: taskStatusSchema.optional().default("todo"),
  priority: taskPrioritySchema.optional().default("medium"),
  dueDate: z.string().datetime().optional().nullable(),
});

export const updateTaskBodySchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(2000).optional().nullable(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    dueDate: z.string().datetime().optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

export const taskParamsSchema = z.object({
  id: z.string().trim().min(1, "Task id is required"),
});

export const listTasksQuerySchema = z.object({
  status: z.preprocess(emptyStringToUndefined, taskStatusSchema.optional()),
  priority: z.preprocess(emptyStringToUndefined, taskPrioritySchema.optional()),
  search: z
    .preprocess(emptyStringToUndefined, z.string().trim().min(1).max(200).optional())
    .optional(),
  sortBy: z.preprocess(
    emptyStringToUndefined,
    z.enum(["createdAt", "dueDate"]).optional().default("createdAt"),
  ),
  order: z.preprocess(emptyStringToUndefined, z.enum(["asc", "desc"]).optional().default("desc")),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type CreateTaskInput = z.infer<typeof createTaskBodySchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskBodySchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
