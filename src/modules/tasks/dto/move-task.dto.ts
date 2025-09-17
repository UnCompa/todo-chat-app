import z from 'zod';

export const MoveTaskSchema = z.object({
  columnId: z.string(),
});
