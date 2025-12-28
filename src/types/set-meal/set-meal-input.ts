import type { Recipe } from "@/types/recipe/recipe"

export interface SetMealInput {
  id: number
  userId: string
  title: string
  memo: string
  recipes: Recipe[]
}

export interface SetMealState {
  success: boolean
  errors?: {
    title?: string[]
    memo?: string[]
    recipes?: string[]
  }
  message?: string | null
}
