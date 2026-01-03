import type { Recipe } from "../recipe/recipe"

export interface CalendarEvent {
  id: number
  userId: string
  date: string
  memo: string | null
  updatedAt: string
  createdAt: string
  recipe: Recipe
}
