import express from "express";
import {
  inviteMemberSchema,
  tokenSchema,
  workspaceSchema,
  workspaceMemberParamsSchema,
} from "../libs/validate-schema.js";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth-middleware.js";
import {
  acceptGenerateInvite,
  acceptInviteByToken,
  createWorkspace,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaces,
  getWorkspaceStats,
  inviteUserToWorkspace,
  removeWorkspaceMember,
} from "../controllers/workspace.js";
import z from "zod";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);
router.post(
  "/accept-invite-token",
  authMiddleware,
  validateRequest({
    body: tokenSchema,
  }),
  acceptInviteByToken
);

router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: inviteMemberSchema,
  }),
  inviteUserToWorkspace
);

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({ params: z.object({ workspaceId: z.string() }) }),
  acceptGenerateInvite
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);

router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);

router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);

router.delete(
  "/:workspaceId/members/:memberId",
  authMiddleware,
  validateRequest({
    params: workspaceMemberParamsSchema,
  }),
  removeWorkspaceMember
);

export default router;
