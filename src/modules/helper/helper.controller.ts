import { Request, Response } from 'express';
import { feedbackAnswerSchema } from './dto/add-new-answer.dto.js';
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

export default {
  addNewAnswerResponse,
};
