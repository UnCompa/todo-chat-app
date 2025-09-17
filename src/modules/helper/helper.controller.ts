import { Request, Response } from 'express';
import { AddColumnSchema } from './dto/add-column.dto.js';
import { feedbackAnswerSchema } from './dto/add-new-answer.dto.js';
import { ReorderColumnDto } from './dto/neworder-columb.dto.js';
import { ParamsColumsDto } from './dto/params-columnds.dto.js';
import { UpdateColumnSchema } from './dto/update-column.dto.js';
import { HelperService } from './helper.service.js';

export const addNewAnswerResponse = async (req: Request, res: Response) => {
  const parseResult = feedbackAnswerSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parseResult.error.format(),
    });
  }
  const { question, answer } = parseResult.data;
  // Logic to handle the new answer response goes here
  if (req.user != null && req.user.id != null) {
    await HelperService.createNewAnswer(req.user.id, question, answer);
    return res.status(201).json({ message: 'Answer added successfully' });
  }
};

export const addColumn = async (req: Request, res: Response) => {
  const parseResult = AddColumnSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parseResult.error.format(),
    });
  }
  const { name, projectId } = parseResult.data;
  // Logic to handle the new answer response goes here

  await HelperService.addColumn({ name, projectId });
  return res.status(201).json({ message: 'Column added successfully' });
};
export const updateColumn = async (req: Request, res: Response) => {
  const parseResult = ParamsColumsDto.safeParse(req.params);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parseResult.error.format(),
    });
  }
  const parseBodyResult = UpdateColumnSchema.safeParse(req.body);

  if (!parseBodyResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parseBodyResult.error.format(),
    });
  }
  const { id } = parseResult.data;
  const { name } = parseBodyResult.data;
  // Logic to handle the new answer response goes here

  await HelperService.updateColumn(id, name);
  return res.status(201).json({ message: 'Column updated successfully' });
};

export const deleteColumn = async (req: Request, res: Response) => {
  const parseResult = ParamsColumsDto.safeParse(req.params);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parseResult.error.format(),
    });
  }
  const { id } = parseResult.data;
  await HelperService.deleteColumn(id);
  return res.status(201).json({ message: 'Column deleted successfully' });
};

export const moveColumn = async (req: Request, res: Response) => {
  const parseParamsResult = ParamsColumsDto.safeParse(req.params);

  if (!parseParamsResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parseParamsResult.error.format(),
    });
  }
  const parseResult = ReorderColumnDto.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parseResult.error.format(),
    });
  }

  const { id } = parseParamsResult.data;
  const { newOrder } = parseResult.data;
  await HelperService.moveColumn(id, newOrder);
  return res.status(201).json({ message: 'Column moved successfully' });
};

export default {
  addNewAnswerResponse,
  addColumn,
  updateColumn,
  deleteColumn,
};
