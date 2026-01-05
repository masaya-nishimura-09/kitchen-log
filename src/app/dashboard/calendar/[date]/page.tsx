import { notFound } from "next/navigation"
import { fetchEvents } from "@/actions/calendar/fetch"
import MainCalendar from "@/components/containers/calendar/calendar"

export default async function Page({ params }: { params: { date: string } }) {
  const { date } = await params
  const events = await fetchEvents()

  if (!events) {
    notFound()
  }
  return <MainCalendar events={events} defaultDate={date} />
}
