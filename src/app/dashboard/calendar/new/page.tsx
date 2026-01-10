import { notFound } from "next/navigation"
import { fetchRecipes } from "@/actions/recipe/fetch"
import CalendarEventForm from "@/components/containers/calendar/calendar-event-form"
export default async function Page() {
  const result = await fetchRecipes(undefined)
  if (!result.success || !result.data) {
    notFound()
  }
  const recipes = result.data

  return (
    <div className="size-full">
      <CalendarEventForm recipes={recipes} />
    </div>
  )
}
