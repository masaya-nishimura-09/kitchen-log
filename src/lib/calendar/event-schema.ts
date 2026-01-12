import { z } from "zod"

export const EventSchema = z.object({
  recipeId: z.number(),
  date: z.string(),
})
