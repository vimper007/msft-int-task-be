import { Router } from "express";

import * as userController from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { userParamsSchema } from "../validators/user.validator";

const router = Router();

router.use(authenticate);

router.get("/:id", validate({ params: userParamsSchema }), asyncHandler(userController.getById));

export default router;
