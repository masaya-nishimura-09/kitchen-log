import type { RecipeRaw } from "@/types/recipe/recipe-raw"

export interface SetMealRaw {
  id: number
  user_id: string
  title: string
  memo: string | null
  updated_at: string
  created_at: string
  set_meal_recipes: {
    id: number
    recipe_id: number
    set_meal_id: number
    recipes: RecipeRaw | RecipeRaw[]
  }[]
}
