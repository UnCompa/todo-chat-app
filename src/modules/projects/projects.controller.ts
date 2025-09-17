import { NextFunction, Request, Response } from 'express';
import { CreateError } from 'src/commons/utils/exceptions.js';
import { ResponseBuilder } from 'src/commons/utils/response.js';
import { addNewProjectDto } from './dto/add-new-project.dto.js';
import { updateProjectDto } from './dto/update-project.dto.js';
import { ProjectService } from './projects.service.js';

export const newProject = async (req: Request, res: Response) => {
  const parseResult = addNewProjectDto.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parseResult.error.format(),
    });
  }

  const { name, description } = parseResult.data;
  if (req.organization != null) {
    await ProjectService.addNewProject({ name, description, organizationId: req.organization.id });
  }
  return res.status(201).json(new ResponseBuilder().setStatus(201).setMessage('Project created successfully'));
};

export const getProjects = async (req: Request, res: Response) => {
  if (req.organization != null) {
    const data = await ProjectService.getProjects({ organizationId: req.organization.id });
    res.status(200).json(new ResponseBuilder().setData(data).setMessage('Projects retrieved successfully'));
  }
};

export const getProjectDetails = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).json(new ResponseBuilder().setMessage('Project ID is required'));
  }
  const data = await ProjectService.getProjectDetails({ id: req.params.id });
  res.status(200).json(new ResponseBuilder().setData(data).setMessage('Project retrieved successfully'));
};

export const updateProject = async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw CreateError.badRequest('Project ID is required.');
  }
  const parseResult = updateProjectDto.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parseResult.error.format(),
    });
  }

  const { name, description } = parseResult.data;
  const data = await ProjectService.update(req.params.id, { name, description });
  res.status(200).json(new ResponseBuilder().setData(data).setMessage('Projects updated successfully'));
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.params.id) {
      await ProjectService.deleteProject(req.params.id);
      res.status(204).send();
    } else {
      throw CreateError.badRequest('Project ID is required.');
    }
  } catch (error) {
    console.info(error);
    next(error);
  }
};
export const undoProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.params.id) {
      await ProjectService.undoProject(req.params.id);
      res.status(200).json(new ResponseBuilder().setMessage('Project restored successfully'));
    } else {
      throw CreateError.badRequest('Project ID is required.');
    }
  } catch (error) {
    console.info(error);
    next(error);
  }
};

export default {
  newProject,
  getProjects,
  deleteProject,
  getProjectDetails,
  updateProject,
  undoProject,
};
