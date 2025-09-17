import { z } from 'zod';

export const AddColumnSchema = z.object({
  name: z.string(),
  projectId: z.string(),
});
