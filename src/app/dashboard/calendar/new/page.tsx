import { fetchRecipes } from "@/actions/recipe/fetch"
import CalendarEventForm from "@/components/containers/calendar/calendar-event-form"
export default async function Page() {
  const recipes = await fetchRecipes(undefined)

  return (
    <div className="size-full">
      <CalendarEventForm recipes={recipes} />
    </div>
  )
}
