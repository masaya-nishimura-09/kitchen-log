"use client"

import { useState, useTransition } from "react"
import { createItem } from "@/actions/shopping-list/create"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { unitList } from "@/lib/recipe/ingredient-unit"
import type {
  ShoppingListItemInput,
  ShoppingListItemState,
} from "@/types/shopping-list/shopping-list-item-input"
import CreateButton from "../button/create-button"

export default function ShoppingListForm() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<ShoppingListItemState>({
    success: true,
    message: null,
    errors: {},
  })

  const [formData, setFormDataAction] = useState<ShoppingListItemInput>({
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
      } else {
        window.location.reload()
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CreateButton link="/dashboard/shopping-list/new" />
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle>アイテムを追加</DialogTitle>
        </DialogHeader>
        <form
          id="new-item-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <Input
            id="ingredient-name"
            name="ingredient-name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormDataAction({ ...formData, name: e.target.value })
            }
            placeholder="材料名を入力してください"
          />

          <div className="flex gap-2 w-full">
            <Input
              id="ingredient-amount"
              name="ingredient-amount"
              type="text"
              value={formData.amount}
              onChange={(e) =>
                setFormDataAction({ ...formData, amount: e.target.value })
              }
              placeholder="量を入力してください"
            />
            <Select
              defaultValue={formData.unit}
              onValueChange={(e) => setFormDataAction({ ...formData, unit: e })}
            >
              <SelectTrigger className="w-30">
                <SelectValue placeholder="単位" />
              </SelectTrigger>
              <SelectContent>
                {unitList.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div aria-live="polite" aria-atomic="true">
            {state?.message && (
              <p className="mt-2 text-red-500 text-sm">{state.message}</p>
            )}
          </div>
        </form>
        <DialogFooter className="flex gap-2">
          <Button type="submit" form="new-item-form" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "登録中..." : "登録"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
