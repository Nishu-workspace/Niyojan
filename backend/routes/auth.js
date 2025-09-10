import express from "express";

import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import {
  loginSchema,
  registerSchema,
  verifyEmailSchema,
} from "../libs/validate-schema.js";
import {
  loginUser,
  registerUser,
  verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest({
    body: registerSchema,
  }),
  registerUser
);
router.post(
  "/login",
  validateRequest({
    body: loginSchema,
  }),
  loginUser
);
router.post(
  "/verfiy-email",
  validateRequest({ body: verifyEmailSchema }),
  verifyEmail
);

export default router;
