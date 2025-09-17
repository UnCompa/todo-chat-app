import { z } from 'zod';

export const UpdateColumnSchema = z.object({
  name: z.string(),
});
