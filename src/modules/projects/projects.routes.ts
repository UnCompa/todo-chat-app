import { Router } from 'express';
import { requireAuth } from 'src/commons/middleware/auth.middleware.js';
import { requireOrganization } from 'src/commons/middleware/organization.middleware.js';
import { requireOwner } from 'src/commons/middleware/roles.middleware.js';
import { newProject } from './projects.controller.js';

const projectsRotuer = Router();

projectsRotuer.post('/add', [requireAuth, requireOrganization, requireOwner], newProject);

export default projectsRotuer;
