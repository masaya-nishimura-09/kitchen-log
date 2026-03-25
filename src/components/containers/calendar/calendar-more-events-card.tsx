import type { Dispatch, SetStateAction } from "react"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { eventColor } from "@/lib/calendar/event-color"
import type { CalendarEvent } from "@/types/calendar/calendar-event"

export default function CalendarMoreEventsCard({
  selectedEvents,
  setSelectedEvent,
  setIsEventOpen,
}: {
  selectedEvents: CalendarEvent[]
  setSelectedEvent: Dispatch<SetStateAction<CalendarEvent | null>>
  setIsEventOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>イベント一覧</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-1">
        {selectedEvents.map((event) => {
          return (
            <button
              type="button"
              key={event.id}
              className={`w-full font-bold text-white rounded-2xl px-2 text-left`}
              style={{
                backgroundColor:
                  eventColor[event.color as keyof typeof eventColor].bg,
              }}
              onClick={() => {
                if (!event.start) return

                setSelectedEvent(event)
                setIsEventOpen(true)
              }}
            >
              {event.title}
            </button>
          )
        })}
      </div>
    </DialogContent>
  )
}
