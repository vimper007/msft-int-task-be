import { Router } from "express";

import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { loginBodySchema, signupBodySchema } from "../validators/auth.validator";

const router = Router();

router.post("/signup", validate({ body: signupBodySchema }), asyncHandler(authController.signup));
router.post("/login", validate({ body: loginBodySchema }), asyncHandler(authController.login));
router.get("/me", authenticate, asyncHandler(authController.me));

export default router;
