// todo: コンポーネント化

"use client"

import type { EventContentArg, EventInput } from "@fullcalendar/core"
import jaLocale from "@fullcalendar/core/locales/ja"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from "@fullcalendar/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useRef, useState, useTransition } from "react"
import { deleteEvent } from "@/actions/calendar/delete"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { eventColor } from "@/lib/calendar/event-color"
// import { eventColor } from "@/lib/calendar/event-color"
import { formatDateToYYYYMMDD, getDateWithDayOfWeek } from "@/lib/date/date"
import type { CalendarEvent } from "@/types/calendar/calendar-event"
import type { Recipe } from "@/types/recipe/recipe"
import CalendarEventForm from "./calendar-event-form"

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <div className="px-2">
      <p className="font-bold">{eventInfo.event.title}</p>
    </div>
  )
}

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

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEventOpen, setIsEventOpen] = useState(false)
  const [isMoreDialogOpen, setIsMoreDialogOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [selectedEventDate, setSelectedEventDate] = useState<string>("")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([])

  const [isPending, startTransition] = useTransition()

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedEventId == null) return

    startTransition(async () => {
      await deleteEvent(selectedEventId)
    })
  }

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
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <CalendarEventForm dateStr={dateStr} recipes={recipes} />
        </Dialog>

        <Dialog open={isEventOpen} onOpenChange={setIsEventOpen}>
          <DialogContent>
            {selectedRecipe && (
              <div className="flex flex-col gap-4">
                <DialogHeader className="flex flex-col gap-4">
                  <DialogTitle>{selectedRecipe?.title}</DialogTitle>
                  <DialogDescription>{selectedEventDate}</DialogDescription>
                </DialogHeader>
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                  <Image
                    src={
                      selectedRecipe.imageUrl
                        ? `/api/recipe-image?path=${selectedRecipe.imageUrl}`
                        : "/image-not-found/cover.png"
                    }
                    alt="recipe image"
                    width={500}
                    height={300}
                    className="h-full w-full rounded-lg object-cover"
                    unoptimized
                  />
                </AspectRatio>

                <DialogFooter className="sm:justify-start">
                  <Button
                    type="button"
                    onClick={(e) => handleDelete(e)}
                    disabled={isPending}
                  >
                    {isPending && <Spinner />}
                    {isPending ? "削除中..." : "削除"}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isMoreDialogOpen} onOpenChange={setIsMoreDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>イベント一覧</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-1">
              {selectedEvents.map((event) => {
                return (
                  <div
                    key={event.id}
                    className={`w-full font-bold text-white rounded-2xl px-2`}
                    style={{
                      backgroundColor:
                        eventColor[event.color as keyof typeof eventColor].bg,
                    }}
                  >
                    {event.title}
                  </div>
                )
              })}
            </div>
          </DialogContent>
        </Dialog>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={renderEventContent}
          locale={jaLocale}
          headerToolbar={false}
          selectable={true}
          dateClick={(info) => {
            setDateStr(info.dateStr)
            setIsFormOpen(true)
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
          moreLinkClick={(arg) => {
            setSelectedEvents(
              arg.allSegs.map((seg) => {
                const event = seg.event
                return {
                  id: Number(event.id),
                  userId: event.extendedProps.userId,
                  title: event.title,
                  start: getDateWithDayOfWeek(
                    formatDateToYYYYMMDD(event.start),
                  ),
                  allDay: true,
                  color: event.backgroundColor,
                  updatedAt: event.extendedProps.updatedAt,
                  createdAt: event.extendedProps.createdAt,
                  recipe: event.extendedProps.recipe,
                }
              }),
            )
            setIsMoreDialogOpen(true)

            return "none"
          }}
          eventClick={(info) => {
            if (!info.event.start) return

            setSelectedEventDate(
              getDateWithDayOfWeek(formatDateToYYYYMMDD(info.event.start)),
            )
            setSelectedEventId(Number(info.event.id))
            setSelectedRecipe(info.event.extendedProps.recipe)
            setIsEventOpen(true)
          }}
        />
      </CardContent>
    </Card>
  )
}
