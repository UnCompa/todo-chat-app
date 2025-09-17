import { z } from 'zod';

export const ReorderColumnDto = z.object({
  newOrder: z.number(),
});
