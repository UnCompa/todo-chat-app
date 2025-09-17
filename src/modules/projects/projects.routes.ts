import { Router } from 'express';
import { requireAuth } from 'src/commons/middleware/auth.middleware.js';
import { requireOrganization } from 'src/commons/middleware/organization.middleware.js';
import { requireMember, requireOwner } from 'src/commons/middleware/roles.middleware.js';
import { catchErrors } from 'src/commons/utils/catchError.js';
import {
  deleteProject,
  getProjectDetails,
  getProjects,
  newProject,
  undoProject,
  updateProject,
} from './projects.controller.js';

const projectsRotuer = Router();

projectsRotuer.post('/add', [requireAuth, requireOrganization, requireOwner], newProject);
projectsRotuer.get('/', [requireAuth, requireOrganization, requireMember], getProjects);
projectsRotuer.put('/:id', [requireAuth, requireOrganization, requireOwner], updateProject);
projectsRotuer.get('/details/:id', [requireAuth, requireOrganization, requireMember], getProjectDetails);
projectsRotuer.delete('/:id', [requireAuth, requireOrganization, requireOwner], catchErrors(deleteProject));
projectsRotuer.post('/undo/:id', [requireAuth, requireOrganization, requireOwner], catchErrors(undoProject));
//TODO: Para buscar, para tener paginacion, para poder restaurar, tener capacidad  de archivar o desarchivar, invitar miembros?, favoritos, etc
export default projectsRotuer;
