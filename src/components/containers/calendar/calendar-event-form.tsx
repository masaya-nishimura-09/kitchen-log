"use client"

import { IconCircleFilled } from "@tabler/icons-react"
import { useState, useTransition } from "react"
import { createEvent } from "@/actions/calendar/create"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { eventColor } from "@/lib/calendar/event-color"
import type { AppActionResult } from "@/types/app-action-result"
import type { EventInput } from "@/types/calendar/event-input"
import type { Recipe } from "@/types/recipe/recipe"
import { getDateWithDayOfWeek } from "../../../lib/date/date"
import RecipeInput from "./recipe-input"

export default function CalendarEventForm({
  dateStr,
  recipes,
}: {
  dateStr: string
  recipes: Recipe[]
}) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<AppActionResult>({
    success: false,
  })

  const [formData, setFormDataAction] = useState<EventInput>({
    recipeId: null,
    start: dateStr,
    color: "blue",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fd = new FormData()

    fd.append(
      "eventData",
      JSON.stringify({
        recipeId: formData.recipeId,
        start: formData.start,
        color: formData.color,
      }),
    )

    startTransition(async () => {
      const result = await createEvent(fd)
      if (!result.success) {
        setState(result)
      }
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{getDateWithDayOfWeek(dateStr)}</DialogTitle>
      </DialogHeader>
      <form
        id="new-event-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full mt-6"
      >
        <Select
          defaultValue={formData.color}
          onValueChange={(e) => setFormDataAction({ ...formData, color: e })}
        >
          <SelectTrigger className="w-max-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(eventColor).map(([key, value]) => {
                return (
                  <SelectItem key={key} value={key}>
                    <IconCircleFilled fill={value.bg} />
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <RecipeInput
          formData={formData}
          setFormDataAction={setFormDataAction}
          state={state}
          recipes={recipes}
        />

        <div aria-live="polite" aria-atomic="true">
          {state?.message && (
            <p className="mt-2 text-red-500 text-sm">{state.message}</p>
          )}
        </div>
      </form>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">キャンセル</Button>
        </DialogClose>
        <Button type="submit" form="new-event-form" disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "登録中..." : "登録"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
