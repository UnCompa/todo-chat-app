import z from "zod";

export const addNewProjectDto = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
})