"use client"

import { IconDots } from "@tabler/icons-react"
import { useTransition } from "react"
import { deleteEvent } from "@/actions/calendar/delete"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import type { CalendarEvent } from "@/types/calendar/calendar-event"

export default function EventMenu({ event }: { event: CalendarEvent }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const result = await deleteEvent(event)
      if (!result.success) {
        console.error(result.message)
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconDots size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={(e) => handleSubmit(e)} disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "削除中..." : "カレンダーから削除する"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
