import { Request, Response } from 'express';
import { ResponseBuilder } from 'src/commons/utils/response.js';
import { io } from 'src/index.js';
import { CreateCommentSchema } from './dto/create-comment.dto.js';
import { createTaskSchema } from './dto/create-tasks.dto.js';
import { projectTasksParamsSchema, projectTasksQuerySchema } from './dto/get-all-tasks-params.dto.js';
import { GetTasksDto } from './dto/get-tasks.dto.js';
import { MoveTaskSchema } from './dto/move-task.dto.js';
import { TasksService } from './tasks.service.js';

export const getAllTasksByProject = async (req: Request, res: Response) => {
  const paramsResult = projectTasksParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: paramsResult.error.format(),
    });
  }
  const { projectId } = paramsResult.data;
  if (req.query) {
    const queryResult = projectTasksQuerySchema.safeParse(req.query);

    if (!queryResult.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: queryResult.error.format(),
      });
    }
    const params = queryResult.data;
    const data = await TasksService.getAllTasksByProject(projectId, params);
    return res.status(200).json(new ResponseBuilder().setData(data.data).setPagination(data.meta));
  }

  const data = await TasksService.getAllTasksByProject(projectId);
  return res.status(200).json(new ResponseBuilder().setData(data.data));
};

export const createdTasks = async (req: Request, res: Response) => {
  const bodyResult = createTaskSchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: bodyResult.error.format(),
    });
  }
  const data = bodyResult.data;
  const tasks = await TasksService.createTask(data);
  io.to(`project:${data.projectId}`).emit('task:created', tasks);
  res.status(200).json(new ResponseBuilder().setData(tasks));
};

export const getTask = async (req: Request, res: Response) => {
  const paramsResult = GetTasksDto.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: paramsResult.error.format(),
    });
  }
  const data = paramsResult.data;
  const tasks = await TasksService.getTask(data.id);
  res.status(200).json(new ResponseBuilder().setData(tasks));
};

export const updateTasks = async (req: Request, res: Response) => {
  const paramsResult = GetTasksDto.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: paramsResult.error.format(),
    });
  }
  const bodyResult = createTaskSchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: bodyResult.error.format(),
    });
  }
  const data = paramsResult.data;
  const tasks = await TasksService.updateTask(data.id, bodyResult.data);
  res.status(200).json(new ResponseBuilder().setData(tasks));
};

export const deleteTask = async (req: Request, res: Response) => {
  const paramsResult = GetTasksDto.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: paramsResult.error.format(),
    });
  }
  const data = paramsResult.data;
  await TasksService.deleteTask(data.id);
  res.status(200).json(new ResponseBuilder().setMessage('Tasks deleted successfully'));
};
export const restoredTask = async (req: Request, res: Response) => {
  const paramsResult = GetTasksDto.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: paramsResult.error.format(),
    });
  }
  const data = paramsResult.data;
  await TasksService.restoredTask(data.id);
  res.status(200).json(new ResponseBuilder().setMessage('Tasks restored successfully'));
};
export const moveTaskColumn = async (req: Request, res: Response) => {
  try {
    const paramsResult = GetTasksDto.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({
        // ← Importante el return
        error: 'Datos inválidos',
        details: paramsResult.error.format(),
      });
    }

    const bodyResult = MoveTaskSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({
        // ← Importante el return
        error: 'Datos inválidos',
        details: bodyResult.error.format(),
      });
    }

    const data = paramsResult.data;
    const newTask = await TasksService.moveTask(data.id, bodyResult.data.columnId);
    req.log.error(newTask, 'Moving Task');
    io.to(`project:${req.project.id}`).emit('task:move', newTask);

    return res.status(200).json(new ResponseBuilder().setMessage('Tasks moved successfully'));
  } catch (error) {
    console.error('Error in moveTaskColumn:', error);

    // Solo responder si no se ha enviado ya una respuesta
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const addComment = async (req: Request, res: Response) => {
  const paramsResult = GetTasksDto.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: paramsResult.error.format(),
    });
  }

  const bodyResult = CreateCommentSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: bodyResult.error.format(),
    });
  }
  const { content } = bodyResult.data;
  if (req.user != null && req.user.id != null && req.user != undefined) {
    await TasksService.createComment(content, req.user.id, paramsResult.data.id);
  }
  res.status(200).json(new ResponseBuilder().setMessage('Comment added successfully'));
};

export const deleteComment = async (req: Request, res: Response) => {
  const paramsResult = GetTasksDto.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: paramsResult.error.format(),
    });
  }

  await TasksService.deleteComment(paramsResult.data.id);
  res.status(200).json(new ResponseBuilder().setMessage('Comment deleted successfully'));
};
