import type { RecipeRaw } from "@/types/recipe/recipe-raw"

export interface SetMealRaw {
  id: number
  user_id: string
  title: string
  memo: string | null
  updated_at: string
  created_at: string
  recips: Array<RecipeRaw>
}
