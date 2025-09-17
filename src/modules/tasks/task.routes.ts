import { Router } from 'express';
import { requireAuth } from 'src/commons/middleware/auth.middleware.js';
import { requireOrganization } from 'src/commons/middleware/organization.middleware.js';
import { requireAdmin, requireMember } from 'src/commons/middleware/roles.middleware.js';
import { catchErrors } from 'src/commons/utils/catchError.js';
import * as taskController from './tasks.controller.js';
const taskRouter = Router();

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
taskRouter.get(
  '/project/:projectId',
  [requireAuth, requireOrganization, requireMember],
  catchErrors(taskController.getAllTasksByProject),
);

taskRouter.post('/', [requireAuth, requireOrganization, requireMember], catchErrors(taskController.createdTasks));
taskRouter.get('/:id', [requireAuth, requireOrganization, requireMember], catchErrors(taskController.getTask));
taskRouter.put('/:id', [requireAuth, requireOrganization, requireMember], catchErrors(taskController.updateTasks));
taskRouter.delete('/:id', [requireAuth, requireOrganization, requireAdmin], catchErrors(taskController.deleteTask));
taskRouter.post(
  '/:id/restored',
  [requireAuth, requireOrganization, requireMember],
  catchErrors(taskController.restoredTask),
);
taskRouter.patch('/:id/move', [requireAuth, requireOrganization], catchErrors(taskController.moveTaskColumn));
taskRouter.post(
  '/:id/comments',
  [requireAuth, requireOrganization, requireMember],
  catchErrors(taskController.addComment),
);
taskRouter.delete(
  '/comments/:id',
  [requireAuth, requireOrganization, requireAdmin],
  catchErrors(taskController.deleteComment),
);

export default taskRouter;
