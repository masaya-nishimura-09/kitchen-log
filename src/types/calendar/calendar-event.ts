import type { Recipe } from "../recipe/recipe"

export interface CalendarEvent {
  id: number
  userId: string
  title: string
  start: string
  allDay: boolean
  color: string
  updatedAt: string
  createdAt: string
  recipe: Recipe
}
