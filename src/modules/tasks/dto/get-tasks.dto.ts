import z from 'zod';

export const GetTasksDto = z.object({
  id: z.string(),
});
