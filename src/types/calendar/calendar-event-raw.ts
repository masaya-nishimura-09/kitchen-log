import type { RecipeRaw } from "../recipe/recipe-raw"

export interface CalendarEventRaw {
  id: number
  user_id: string
  recipe_id: number
  date: string
  memo: string | null
  updated_at: string
  created_at: string
  recipes: RecipeRaw | RecipeRaw[]
}
