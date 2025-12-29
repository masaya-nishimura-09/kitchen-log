import type { Recipe } from "@/types/recipe/recipe"

export interface SetMealInput {
  id: number
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
