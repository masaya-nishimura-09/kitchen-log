import type { Recipe } from "@/types/recipe/recipe"

export interface SetMealInput {
  id: number
  title: string
  memo: string
  recipes: Recipe[]
}
