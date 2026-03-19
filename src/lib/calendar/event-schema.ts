import { z } from "zod"

export const EventSchema = z.object({
  recipeId: z.number(),
  start: z.string(),
  color: z.string(),
})
