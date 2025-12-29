"use client"

import { IconCircleX } from "@tabler/icons-react"
import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type {
  SetMealInput,
  SetMealState,
} from "@/types/set-meal/set-meal-input"

export default function RecipesInput({
  formData,
  setFormDataAction,
  state,
}: {
  formData: SetMealInput
  setFormDataAction: Dispatch<SetStateAction<SetMealInput>>
  state: SetMealState | undefined
}) {
  const [inputValue, setInputValue] = useState("")

  function handleAddRecipe() {}

  function handleRemoveRecipe(id: number) {
    setFormDataAction({
      ...formData,
      recipes: formData.recipes.filter((r) => r.id !== id),
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleAddRecipe()
    }
  }

  return (
    <AccordionContent className="grid gap-2 max-w-xl">
      <div className="flex w-full items-center gap-2">
        <Input
          id="recipes"
          name="recipes"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" variant="outline" onClick={handleAddRecipe}>
          追加
        </Button>
      </div>

      <div className="flex w-full flex-wrap gap-2">
        {formData.recipes.map((r) => (
          <Badge key={r.id} variant="secondary">
            <div className="flex items-center gap-1">
              <span>{r.title}</span>
              <button
                type="button"
                className="rounded-full"
                onClick={() => handleRemoveRecipe(r.id)}
              >
                <IconCircleX size={18} />
              </button>
            </div>
          </Badge>
        ))}
      </div>

      <div aria-live="polite" aria-atomic="true">
        {state?.errors?.recipes?.map((error: string) => (
          <p className="mt-2 text-red-500 text-sm" key={error}>
            {error}
          </p>
        ))}
      </div>
    </AccordionContent>
  )
}
