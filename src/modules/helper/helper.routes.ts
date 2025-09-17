import { Router } from 'express';
import { requireAuth } from 'src/commons/middleware/auth.middleware.js';
import { requireOrganization } from 'src/commons/middleware/organization.middleware.js';
import { requireAdmin, requireOwner } from 'src/commons/middleware/roles.middleware.js';
import { addColumn, addNewAnswerResponse, deleteColumn, moveColumn, updateColumn } from './helper.controller.js';

const helperRouter = Router();

helperRouter.post('/add-answer-result', requireAuth, addNewAnswerResponse);
helperRouter.post('/columns', [requireAuth, requireOrganization, requireAdmin], addColumn);
helperRouter.put('/columns/:id', [requireAuth, requireOrganization, requireAdmin], updateColumn);
helperRouter.delete('/columns/:id', [requireAuth, requireOrganization, requireOwner], deleteColumn);
helperRouter.post('/columns/:id/move', [requireAuth, requireOrganization, requireOwner], moveColumn);

export default helperRouter;
