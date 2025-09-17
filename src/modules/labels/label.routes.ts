import { Router } from 'express';
import { requireAuth } from 'src/commons/middleware/auth.middleware.js';
import { requireOrganization } from 'src/commons/middleware/organization.middleware.js';
import { requireProjectAccess } from 'src/commons/middleware/project.middleware.js';
import { requireAdmin } from 'src/commons/middleware/roles.middleware.js';
import { createLabel, deleteLabel, getLabels, undoLabel, updateLabel } from './label.controller.js';

const labelRouter = Router();

labelRouter.post('/', [requireAuth, requireOrganization, requireAdmin], createLabel);
labelRouter.get(
  '/project/:projectId',
  [requireAuth, requireOrganization, requireAdmin, requireProjectAccess],
  getLabels,
);

labelRouter.put('/:id', [requireAuth, requireOrganization, requireAdmin], updateLabel);
labelRouter.delete('/:id', [requireAuth, requireOrganization, requireAdmin], deleteLabel);
labelRouter.post('/:id/undo', [requireAuth, requireOrganization, requireAdmin], undoLabel);

export default labelRouter;
