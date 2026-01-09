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
import type { Recipe } from "@/types/recipe/recipe"
import {
  formatDateToYYYYMMDD,
  getDateWithDayOfWeek,
} from "../../../lib/date/date"
import Recipes from "../recipe/recipes"

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

  const [recipes, setRecipes] = useState<Recipe[]>(
    events.filter((e) => e.date === defaultDateStr).map((e) => e.recipe),
  )

  const handleSelect = (date: Date | undefined) => {
    const selectedRecipes = events
      .filter((e) => e.date === formatDateToYYYYMMDD(date))
      .map((e) => e.recipe)
    setRecipes(selectedRecipes)
  }

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
                setDate(date)
                handleSelect(date)
                setOpen(false)
              }}
              locale={ja}
            />
          </PopoverContent>
        </Popover>

        <Recipes recipes={recipes} size={"280"} />
      </CardContent>
    </Card>
  )
}
