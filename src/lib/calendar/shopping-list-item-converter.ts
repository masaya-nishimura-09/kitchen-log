import type { EventInput } from "@fullcalendar/core"
import type { CalendarEventRaw } from "@/types/calendar/calendar-event-raw"
import { recipeConverter } from "../recipe/recipe-converter"

export function calendarEventConverter(data: CalendarEventRaw): EventInput {
  return {
    id: String(data.id),
    userId: data.user_id as string,
    title: recipeConverter(
      Array.isArray(data.recipes) ? data.recipes[0] : data.recipes,
    ).title,
    start: data.start as string,
    allDay: true,
    backgroundColor: data.background_color,
    borderColor: data.border_color,
    updatedAt: data.updated_at as string,
    createdAt: data.created_at as string,
    recipe: recipeConverter(
      Array.isArray(data.recipes) ? data.recipes[0] : data.recipes,
    ),
  }
}
