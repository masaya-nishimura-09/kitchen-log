import { z } from "zod"

export const EventFormSchema = z.object({
  recipeId: z.number(),
  date: z.string(),
})
