import type { RecipeRaw } from "../recipe/recipe-raw"

export interface CalendarEventRaw {
  id: number
  user_id: string
  recipe_id: number
  start: string
  color: string
  updated_at: string
  created_at: string
  recipes: RecipeRaw | RecipeRaw[]
}
