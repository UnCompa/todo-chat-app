import { Router } from "express";
import { requireAuth } from "src/commons/middleware/auth.middleware.js";
import { requireOrganization } from "src/commons/middleware/organization.middleware.js";
import * as taskController from "./tasks.controller.js";
const taskRouter = Router()

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get all tasks
 *     description: Retrieve a list of all tasks for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized – missing or invalid token.
 *       500:
 *         description: Internal server error
 */
taskRouter.get('/', [requireAuth, requireOrganization], taskController.getTasks);


export default taskRouter;