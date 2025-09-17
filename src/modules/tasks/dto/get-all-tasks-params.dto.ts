import { z } from 'zod';

// Params: /tasks/project/:projectId
export const projectTasksParamsSchema = z.object({
  projectId: z.string().min(1, 'projectId is required'),
});

// Query: ?page=1&limit=10&status=...&label=...&assignedTo=...
export const projectTasksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
  status: z.string().optional(),
  label: z.string().optional(),
  assignedTo: z.string().optional(),
});
