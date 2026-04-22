import { Router } from "express";

import * as taskController from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import {
  createTaskBodySchema,
  listTasksQuerySchema,
  taskParamsSchema,
  updateTaskBodySchema,
} from "../validators/task.validator";

const router = Router();

router.use(authenticate);

router.get("/", validate({ query: listTasksQuerySchema }), asyncHandler(taskController.getTasks));
router.get("/:id", validate({ params: taskParamsSchema }), asyncHandler(taskController.getTaskById));
router.post("/", validate({ body: createTaskBodySchema }), asyncHandler(taskController.createTask));
router.put(
  "/:id",
  validate({ params: taskParamsSchema, body: updateTaskBodySchema }),
  asyncHandler(taskController.updateTask),
);
router.delete("/:id", validate({ params: taskParamsSchema }), asyncHandler(taskController.deleteTask));

export default router;
