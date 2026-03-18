"use client"

import jaLocale from "@fullcalendar/core/locales/ja"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from "@fullcalendar/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDateToYYYYMMDD, getDateWithDayOfWeek } from "@/lib/date/date"
import type { CalendarEvent } from "@/types/calendar/calendar-event"

export default function MainCalendar({ events }: { events: CalendarEvent[] }) {
  const today = new Date()
  const todayStr = formatDateToYYYYMMDD(today)
  const [date, setDate] = useState<string>(todayStr)

  const calendarRef = useRef<FullCalendar>(null)

  const handlePrev = () => calendarRef.current?.getApi().prev()
  const handleNext = () => calendarRef.current?.getApi().next()

  const handleTodayClick = () => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.today()
      calendarApi.select(todayStr)
      setDate(todayStr)
    }
  }

  const eventExample = [
    {
      title: "温泉旅行",
      start: new Date(),
      end: new Date().setDate(new Date().getDate() + 5),
      description: "友達と温泉旅行",
      backgroundColor: "green",
      borderColor: "green",
    },
    {
      title: "期末テスト",
      start: new Date().setDate(new Date().getDate() + 5),
      description: "2年最後の期末テスト",
      backgroundColor: "blue",
      borderColor: "blue",
    },
  ]

  return (
    <Card className="flex flex-col size-full">
      <CardHeader>
        <CardTitle>{getDateWithDayOfWeek(date)}</CardTitle>
        <CardAction>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="default" onClick={handleTodayClick}>
              今日
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={eventExample}
          locale={jaLocale}
          headerToolbar={false}
          selectable={true}
          dateClick={(info) => {
            setDate(info.dateStr)
          }}
          height="100%"
        />
      </CardContent>
    </Card>
  )
}
