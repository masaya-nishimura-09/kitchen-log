import { z } from "zod"

export const EventSchema = z.object({
  recipeId: z.number({ message: "レシピを選択してください。" }),
  start: z.string(),
  color: z.string(),
})
