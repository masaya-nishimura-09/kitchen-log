"use client"

import { IconDots } from "@tabler/icons-react"
import Link from "next/link"
import { useTransition } from "react"
import { Toaster, toast } from "sonner"
import { createFromRecipe } from "@/actions/shopping-list/create"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import type { SetMeal } from "@/types/set-meal/set-meal"
import EventForm from "./event-form"

export default function SetMealMenu({ setMeal }: { setMeal: SetMeal }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      await createFromRecipe(setMeal.recipes)
      toast.success("追加に成功しました！")
    })
  }

  return (
    <DropdownMenu>
      <Toaster richColors position="top-center" />
      <DropdownMenuTrigger>
        <IconDots />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href={`/dashboard/set-meal/${setMeal.id}/edit`}>編集する</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => handleSubmit(e)} disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "買い物リストに追加中..." : "買い物リストに追加"}
        </DropdownMenuItem>
        <EventForm recipes={setMeal.recipes} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
