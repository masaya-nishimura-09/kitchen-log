"use client"

import { ja } from "date-fns/locale"
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"
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
import type { Recipe } from "@/types/recipe/recipe"
import {
  formatDateToYYYYMMDD,
  getDateWithDayOfWeek,
} from "../../../lib/date/date"
import RecipeCard from "../recipe/recipe-card"
import EventForm from "./event-form"

export default function MainCalendar({
  recipes,
  events,
}: {
  recipes: Recipe[]
  events: CalendarEvent[]
}) {
  const today = new Date()
  const [date, setDate] = useState<string>(
    getDateWithDayOfWeek(formatDateToYYYYMMDD(today)),
  )
  const [open, setOpen] = useState(false)

  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>(
    events.filter((e) => e.date === formatDateToYYYYMMDD(today)),
  )

  return (
    <Card className="size-full">
      <CardHeader className="flex flex-col md:flex-row justify-between gap-2">
        <CardTitle>カレンダー</CardTitle>
        <CardAction>
          <EventForm recipes={recipes} />
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
              {date}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={today}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(getDateWithDayOfWeek(formatDateToYYYYMMDD(date)))
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
                <RecipeCard key={e.id} recipe={e.recipe} />
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
