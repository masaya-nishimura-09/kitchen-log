"use client"

import { IconDots } from "@tabler/icons-react"
import Link from "next/link"
import { useTransition } from "react"
import { createFromRecipe } from "@/actions/shopping-list/create"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import type { Recipe } from "@/types/recipe/recipe"
import EventForm from "./form/event-form"

export default function RecipeMenu({ recipe }: { recipe: Recipe }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      await createFromRecipe([recipe])
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconDots />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link
            href={`/dashboard/recipe/${recipe.id}/edit`}
            className="size-full"
          >
            編集する
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => handleSubmit(e)} disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "買い物リストに追加中..." : "買い物リストに追加"}
        </DropdownMenuItem>
        <EventForm id={recipe.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
