// todo: notFoundではなく他のエラーを検討

import { notFound } from "next/navigation"
import { fetchEvents } from "@/actions/calendar/fetch"
import { fetchRecipes } from "@/actions/recipe/fetch"
import MainCalendar from "@/components/containers/calendar/main-calendar"

export default async function Page() {
  const fetchEventsResult = await fetchEvents()
  if (!fetchEventsResult.success || !fetchEventsResult.data) {
    notFound()
  }

  const fetchRecipesResult = await fetchRecipes(undefined)
  if (!fetchRecipesResult.success || !fetchRecipesResult.data) {
    notFound()
  }

  return (
    <MainCalendar
      events={fetchEventsResult.data}
      recipes={fetchRecipesResult.data}
    />
  )
}
