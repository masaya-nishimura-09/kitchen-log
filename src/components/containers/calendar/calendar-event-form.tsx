"use client"

import { ja } from "date-fns/locale"
import { ChevronDownIcon } from "lucide-react"
import { useState, useTransition } from "react"
import { createEvent } from "@/actions/calendar/create"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import type { EventInput, EventState } from "@/types/calendar/event-input"
import type { Recipe } from "@/types/recipe/recipe"
import {
  formatDateToYYYYMMDD,
  getDateWithDayOfWeek,
} from "../../../lib/date/date"
import RecipeInput from "./recipe-input"

export default function CalendarEventForm({ recipes }: { recipes: Recipe[] }) {
  const [open, setOpen] = useState(false)

  const today = new Date()

  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<EventState>({
    success: true,
    message: null,
    errors: {},
  })

  const [formData, setFormDataAction] = useState<EventInput>({
    recipeId: null,
    date: formatDateToYYYYMMDD(today),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fd = new FormData()

    fd.append(
      "eventData",
      JSON.stringify({
        recipeId: formData.recipeId,
        date: formData.date,
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
    <Card className="size-full">
      <CardHeader>
        <CardTitle>カレンダーに追加</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form
          id="new-event-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-md"
        >
          <div className="grid gap-2">
            <Label htmlFor="date" className="px-1">
              日付を選択してください
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal"
                >
                  {getDateWithDayOfWeek(formData.date)}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={today}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setFormDataAction({
                      ...formData,
                      date: formatDateToYYYYMMDD(date),
                    })
                    setOpen(false)
                  }}
                  locale={ja}
                />
              </PopoverContent>
            </Popover>
            <div aria-live="polite" aria-atomic="true">
              {state?.errors?.date?.map((error: string) => (
                <p className="mt-2 text-red-500 text-sm" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>

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
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button type="submit" form="new-event-form" disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "登録中..." : "登録"}
        </Button>
      </CardFooter>
    </Card>
  )
}
