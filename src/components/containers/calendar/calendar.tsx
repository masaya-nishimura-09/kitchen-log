"use client"

import type { EventInput } from "@fullcalendar/core"
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
import { Dialog } from "@/components/ui/dialog"
import { formatDateToYYYYMMDD } from "@/lib/date/date"
import type { Recipe } from "@/types/recipe/recipe"
import CalendarEventForm from "./calendar-event-form"

export default function MainCalendar({
  events,
  recipes,
}: {
  events: EventInput[]
  recipes: Recipe[]
}) {
  const today = new Date()
  const todayStr = formatDateToYYYYMMDD(today)
  const [dateStr, setDateStr] = useState<string>(todayStr)

  const calendarRef = useRef<FullCalendar>(null)

  const handlePrev = () => calendarRef.current?.getApi().prev()
  const handleNext = () => calendarRef.current?.getApi().next()

  const [yearMonth, setYearMonth] = useState<{
    year: number
    month: number
  }>({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  })

  const handleTodayClick = () => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.today()
      calendarApi.select(todayStr)
      setDateStr(todayStr)
    }
  }

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="flex flex-col size-full">
      <CardHeader>
        <CardTitle>
          {yearMonth.year}年{yearMonth.month}月
        </CardTitle>
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <CalendarEventForm dateStr={dateStr} recipes={recipes} />
        </Dialog>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          locale={jaLocale}
          headerToolbar={false}
          selectable={true}
          dateClick={(info) => {
            setDateStr(info.dateStr)
            setIsOpen(true)
          }}
          datesSet={(info) => {
            const date = info.view.currentStart
            setYearMonth({
              year: date.getFullYear(),
              month: date.getMonth() + 1,
            })
          }}
          height="100%"
          displayEventTime={false}
          dayMaxEvents={3}
        />
      </CardContent>
    </Card>
  )
}
