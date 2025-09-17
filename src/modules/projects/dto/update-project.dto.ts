import z from 'zod';

export const updateProjectDto = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
});
