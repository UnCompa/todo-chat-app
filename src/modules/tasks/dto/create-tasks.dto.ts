import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.string().optional(), // Puedes hacer un enum si sabes los valores posibles
  priority: z.string().optional(), // Igual aquí
  dueDate: z.coerce.date().optional(),

  projectId: z.string().min(1, 'projectId is required'),
  columnId: z.string().min(1, 'columnId is required'),

  assignedTo: z.array(z.string()).optional(),
  labelIds: z.array(z.string()).optional(),
});
