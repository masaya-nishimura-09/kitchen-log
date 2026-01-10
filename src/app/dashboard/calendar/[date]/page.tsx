import { notFound } from "next/navigation"
import { fetchEvents } from "@/actions/calendar/fetch"
import MainCalendar from "@/components/containers/calendar/calendar"

export default async function Page({ params }: { params: { date: string } }) {
  const { date } = await params
  const result = await fetchEvents()

  if (!result.success || !result.data) {
    notFound()
  }
  const events = result.data
  return <MainCalendar events={events} defaultDateStr={date} />
}
