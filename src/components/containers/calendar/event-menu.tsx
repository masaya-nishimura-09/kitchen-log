"use client"

import { IconDotsVertical } from "@tabler/icons-react"
import { useTransition } from "react"
import { Toaster, toast } from "sonner"
import { deleteEvent } from "@/actions/calendar/delete"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"

export default function EventMenu({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      await deleteEvent(id)
      toast.success("追加に成功しました！")
    })
  }

  return (
    <DropdownMenu>
      <Toaster richColors position="top-center" />
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
