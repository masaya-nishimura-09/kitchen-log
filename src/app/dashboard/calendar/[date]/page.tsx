import { notFound } from "next/navigation"
import { fetchEvents } from "@/actions/calendar/fetch"
import { fetchRecipes } from "@/actions/recipe/fetch"
import MainCalendar from "@/components/containers/calendar/calendar"

export default async function Page({ params }: { params: { date: string } }) {
  const { date } = await params
  const recipes = await fetchRecipes(undefined)
  const events = await fetchEvents()

  if (!recipes) {
    notFound()
  }
  return <MainCalendar recipes={recipes} events={events} defaultDate={date} />
}
