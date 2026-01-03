import type { Recipe } from "../recipe/recipe"

export interface CalendarEvent {
  id: number
  userId: string
  date: string
  updatedAt: string
  createdAt: string
  recipe: Recipe
}
