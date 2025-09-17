import z from 'zod';

export const CreateLabelSchema = z.object({
  name: z.string(),
  color: z.string(),
  projectId: z.string(),
});
