import { z } from "zod"

export const EventFormSchema = z.object({
  recipeId: z.number(),
  date: z.string(),
  memo: z
    .string()
    .max(500)
    .transform((val) => (val === "" ? null : val)),
})
