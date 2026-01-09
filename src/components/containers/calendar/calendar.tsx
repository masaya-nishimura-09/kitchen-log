"use client"

import { ja } from "date-fns/locale"
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import CreateButton from "@/components/containers/button/create-button"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { CalendarEvent } from "@/types/calendar/calendar-event"
import {
  formatDateToYYYYMMDD,
  getDateWithDayOfWeek,
} from "../../../lib/date/date"
import RecipeCard from "../recipe/recipe-card"
import EventMenu from "./event-menu"

export default function MainCalendar({
  events,
  defaultDateStr,
}: {
  events: CalendarEvent[]
  defaultDateStr: string
}) {
  const defaultDate = new Date(defaultDateStr)

  const [date, setDate] = useState<Date | undefined>(defaultDate)

  const [open, setOpen] = useState(false)

  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>(
    events.filter((e) => e.date === defaultDateStr),
  )

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>カレンダー</CardTitle>
        <CardAction>
          <CreateButton link="/dashboard/calendar/new" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal"
            >
              {date
                ? getDateWithDayOfWeek(formatDateToYYYYMMDD(date))
                : "日付を選択"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                console.log(date)
                setDate(date)
                setSelectedEvents(
                  events.filter((e) => e.date === formatDateToYYYYMMDD(date)),
                )
                setOpen(false)
              }}
              locale={ja}
            />
          </PopoverContent>
        </Popover>

        <div>
          {selectedEvents.length > 0 ? (
            <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
              {selectedEvents.map((e) => (
                <RecipeCard
                  key={e.id}
                  menuButton={<EventMenu event={e} />}
                  recipe={e.recipe}
                />
              ))}
            </div>
          ) : (
            <p>レシピがありません。</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
