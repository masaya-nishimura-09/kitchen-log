"use client"

import { IconDotsVertical } from "@tabler/icons-react"
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
      await deleteEvent(event)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconDotsVertical />
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
