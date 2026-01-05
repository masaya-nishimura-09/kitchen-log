"use client"

import { ja } from "date-fns/locale"
import { ChevronDownIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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
import EventForm from "./event-form"
import EventMenu from "./event-menu"

export default function MainCalendar({
  recipes,
  events,
  defaultDate,
}: {
  recipes: Recipe[]
  events: CalendarEvent[]
  defaultDate: string
}) {
  const dD = new Date(defaultDate)
  const [date, setDate] = useState<Date | undefined>(dD)

  const [dateStr, setDateStr] = useState<string>(
    getDateWithDayOfWeek(defaultDate),
  )
  const [open, setOpen] = useState(false)

  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>(
    events.filter((e) => e.date === defaultDate),
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
              {dateStr}
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
                setDateStr(getDateWithDayOfWeek(formatDateToYYYYMMDD(date)))
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
                <Link
                  key={e.id}
                  href={`/dashboard/recipe/${e.recipe.id}`}
                  className="aspect-video flex flex-col gap-2 rounded-lg bg-popover hover:bg-muted transition-colors p-2"
                >
                  <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                    <Image
                      src={
                        e.recipe.imageUrl
                          ? `/api/recipe-image?path=${e.recipe.imageUrl}`
                          : "/image-not-found/cover.png"
                      }
                      alt="recipe image"
                      width={500}
                      height={300}
                      className="h-full w-full rounded-lg object-cover"
                      unoptimized
                    />
                  </AspectRatio>
                  <div className="flex gap-2 justify-between items-center">
                    <p className="whitespace-nowrap overflow-hidden text-ellipsis font-semibold">
                      {e.recipe.title}
                    </p>
                    <EventMenu id={e.id} />
                  </div>
                </Link>
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
