import { Request, Response } from 'express';
import { ResponseBuilder } from 'src/commons/utils/response.js';
import { CreateLabelSchema } from './dto/create-label.dto.js';
import { ParamsLabel } from './dto/params-label.dto.js';
import { LabelService } from './label.service.js';

export const createLabel = async (req: Request, res: Response) => {
  const bodyResult = CreateLabelSchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      error: 'Datos invalidos',
      details: bodyResult.error.format(),
    });
  }

  const data = bodyResult.data;
  const label = await LabelService.createLabel(data.name, data.color, data.projectId);
  res.status(200).json(new ResponseBuilder().setData(label));
};
export const getLabels = async (req: Request, res: Response) => {
  if (req.project != null) {
    const labels = await LabelService.getAll(req.project.id);
    res.status(200).json(new ResponseBuilder().setData(labels));
  }
  res.status(200).json(new ResponseBuilder().setMessage('No data avalible'));
};

export const updateLabel = async (req: Request, res: Response) => {
  const bodyResult = CreateLabelSchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      error: 'Datos invalidos',
      details: bodyResult.error.format(),
    });
  }

  const paramsResult = ParamsLabel.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      error: 'Datos invalidos',
      details: paramsResult.error.format(),
    });
  }

  const dataParams = paramsResult.data;

  const data = bodyResult.data;
  const label = await LabelService.updateLabel(dataParams.id, { ...data });
  res.status(200).json(new ResponseBuilder().setData(label).setMessage('Label updated successfully'));
};
export const deleteLabel = async (req: Request, res: Response) => {
  const paramsResult = ParamsLabel.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      error: 'Datos invalidos',
      details: paramsResult.error.format(),
    });
  }

  const data = paramsResult.data;
  const label = await LabelService.delete(data.id);
  res.status(200).json(new ResponseBuilder().setData(label).setMessage('Label deleted successfully'));
};
export const undoLabel = async (req: Request, res: Response) => {
  const paramsResult = ParamsLabel.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      error: 'Datos invalidos',
      details: paramsResult.error.format(),
    });
  }

  const data = paramsResult.data;
  const label = await LabelService.undo(data.id);
  res.status(200).json(new ResponseBuilder().setData(label).setMessage('Label restored successfully'));
};
