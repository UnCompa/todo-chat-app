import z from 'zod';

export const ParamsLabel = z.object({
  id: z.string(),
});
