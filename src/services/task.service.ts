import { Prisma, Task } from "@prisma/client";

import { ApiError } from "../errors/api-error";
import { prisma } from "../prisma/client";
import { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "../validators/task.validator";

export interface TaskListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListTasksResult {
  tasks: Task[];
  meta: TaskListMeta;
}

function buildTaskWhere(userId: string, query: ListTasksQuery): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = {
    userId,
  };

  if (query.status) {
    where.status = query.status;
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search,
        },
      },
      {
        description: {
          contains: query.search,
        },
      },
    ];
  }

  return where;
}

export async function listTasks(userId: string, query: ListTasksQuery): Promise<ListTasksResult> {
  const where = buildTaskWhere(userId, query);
  const skip = (query.page - 1) * query.limit;
  const orderBy = { [query.sortBy]: query.order } as Prisma.TaskOrderByWithRelationInput;

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      skip,
      take: query.limit,
      orderBy,
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}

export async function getTaskById(userId: string, taskId: string): Promise<Task> {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
}

export async function createTask(userId: string, input: CreateTaskInput): Promise<Task> {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      userId,
    },
  });
}

export async function updateTask(userId: string, taskId: string, input: UpdateTaskInput): Promise<Task> {
  await getTaskById(userId, taskId);

  const updateData: Prisma.TaskUncheckedUpdateInput = {};

  if (input.title !== undefined) {
    updateData.title = input.title;
  }

  if (input.description !== undefined) {
    updateData.description = input.description;
  }

  if (input.status !== undefined) {
    updateData.status = input.status;
  }

  if (input.priority !== undefined) {
    updateData.priority = input.priority;
  }

  if (input.dueDate !== undefined) {
    updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;
  }

  return prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  await getTaskById(userId, taskId);

  await prisma.task.delete({
    where: { id: taskId },
  });
}
