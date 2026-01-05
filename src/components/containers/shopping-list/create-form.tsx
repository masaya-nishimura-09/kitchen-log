"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { createItem } from "@/actions/shopping-list/create"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { unitList } from "@/lib/recipe/ingredient-unit"
import type {
  ShoppingListItemInput,
  ShoppingListItemState,
} from "@/types/shopping-list/shopping-list-item-input"

export default function CreateForm() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<ShoppingListItemState>({
    success: true,
    message: null,
    errors: {},
  })

  const [formData, _setFormDataAction] = useState<ShoppingListItemInput>({
    id: 0,
    name: "",
    amount: "",
    unit: unitList[0].value,
    status: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fd = new FormData()

    fd.append(
      "shoppingListItemData",
      JSON.stringify({
        id: formData.id,
        name: formData.name,
        amount: formData.amount,
        unit: formData.unit,
        status: formData.status,
      }),
    )

    startTransition(async () => {
      const result = await createItem(fd)
      if (!result.success) {
        setState(result)
      }
    })
  }

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>アイテムを追加</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="new-item-form"
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <div aria-live="polite" aria-atomic="true">
            {state?.message && (
              <p className="mt-2 text-red-500 text-sm">{state.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button type="submit" form="new-item-form" disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "登録中..." : "登録"}
        </Button>
        <Button type="button" variant="outline" disabled={isPending}>
          <Link href="/dashboard/shopping-list">キャンセル</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
