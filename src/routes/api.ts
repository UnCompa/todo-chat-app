import { Router } from "express";
import { authController } from "src/modules/auth/auth.controller.js";
import helperRouter from "src/modules/helper/helper.routes.js";
import projectsRotuer from "src/modules/projects/projects.routes.js";
import taskRouter from "src/modules/tasks/task.routes.js";

const mainRouter = Router()

mainRouter.use('/auth', authController);
mainRouter.use('/tasks', taskRouter);
mainRouter.use('/helper', helperRouter);
mainRouter.use('/projects', projectsRotuer);

export default mainRouter;