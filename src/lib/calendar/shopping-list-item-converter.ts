import type { CalendarEvent } from "@/types/calendar/calendar-event"
import type { CalendarEventRaw } from "@/types/calendar/calendar-event-raw"
import { recipeConverter } from "../recipe/recipe-converter"

export function calendarEventConverter(data: CalendarEventRaw): CalendarEvent {
  return {
    id: data.id as number,
    userId: data.user_id as string,
    date: data.date as string,
    updatedAt: data.updated_at as string,
    createdAt: data.created_at as string,
    recipe: recipeConverter(
      Array.isArray(data.recipes) ? data.recipes[0] : data.recipes,
    ),
  }
}
