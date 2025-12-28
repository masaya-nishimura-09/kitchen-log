import type { Recipe } from "@/types/recipe/recipe"

export interface SetMeal {
  id: number
  userId: string
  title: string
  memo: string | null
  recipes: Recipe[]
  updatedAt: string
  createdAt: string
}
