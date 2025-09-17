import { Router } from 'express';
import { addNewAnswerResponse } from './helper.controller.js';
import { requireAuth } from 'src/commons/middleware/auth.middleware.js';

const helperRouter = Router();

helperRouter.post('/add-answer-result', requireAuth, addNewAnswerResponse);

export default helperRouter;
