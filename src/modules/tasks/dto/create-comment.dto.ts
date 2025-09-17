import z from 'zod';

export const CreateCommentSchema = z.object({
  content: z.string(),
});
