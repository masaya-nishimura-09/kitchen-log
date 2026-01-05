"use client"

import { IconCircleX } from "@tabler/icons-react"
import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Item, ItemActions, ItemContent } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { unitList } from "@/lib/recipe/ingredient-unit"
import type {
  ShoppingListItemInput,
  ShoppingListItemState,
} from "@/types/shopping-list/shopping-list-item-input"

export default function ItemInput({
  formData,
  setFormDataAction,
}: {
  formData: ShoppingListItemInput[]
  setFormDataAction: Dispatch<SetStateAction<ShoppingListItemInput[]>>
  state: ShoppingListItemState | undefined
}) {
  const [inputValue, setInputValue] = useState({
    name: "",
    amount: "",
    unit: unitList[0].value,
  })

  function handleAddIngredient() {
    const trimmedName = inputValue.name.trim()
    const trimmedAmount = inputValue.amount.trim()

    if (!trimmedName) return

    if (formData.some((i) => i.name === trimmedName)) return

    setFormDataAction([
      ...formData,
      {
        id: 0,
        name: trimmedName,
        amount: trimmedAmount,
        unit: inputValue.unit,
        status: false,
      },
    ])
    setInputValue({
      name: "",
      amount: "",
      unit: unitList[0].value,
    })
  }

  function handleRemoveItem(name: string) {
    setFormDataAction(formData.filter((i) => i.name !== name))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleAddIngredient()
    }
  }

  return (
    <div className="grid gap-2 md:max-w-sm w-full">
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="ingredient-name">材料名</Label>
          <Input
            id="ingredient-name"
            name="ingredient-name"
            type="text"
            value={inputValue.name}
            onChange={(e) =>
              setInputValue({ ...inputValue, name: e.target.value })
            }
            onKeyDown={handleKeyDown}
            placeholder="材料名を入力してください"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ingredient-amount">量</Label>
          <div className="flex gap-2">
            <Input
              id="ingredient-amount"
              name="ingredient-amount"
              type="text"
              value={inputValue.amount}
              onChange={(e) =>
                setInputValue({ ...inputValue, amount: e.target.value })
              }
              onKeyDown={handleKeyDown}
              placeholder="量を入力してください"
            />
            <Select
              defaultValue={inputValue.unit}
              onValueChange={(e) => setInputValue({ ...inputValue, unit: e })}
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
        </div>
        <div>
          <Button type="button" variant="outline" onClick={handleAddIngredient}>
            追加
          </Button>
        </div>
      </div>

      <Separator className="my-2" />

      <div className="flex flex-col gap-2">
        {formData.map((i) => (
          <Item key={i.name} variant="outline" size="sm" className="max-w-full">
            <ItemContent>
              <div className="flex gap-1">
                <span className="break-all">{i.name}</span>
                <span className="break-all">...</span>
                <span className="break-all">{i.amount}</span>
                <span className="break-all">{i.unit}</span>
              </div>
            </ItemContent>
            <ItemActions>
              <button
                type="button"
                className="rounded-full shrink-0"
                onClick={() => handleRemoveItem(i.name)}
              >
                <IconCircleX size={18} />
              </button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </div>
  )
}
