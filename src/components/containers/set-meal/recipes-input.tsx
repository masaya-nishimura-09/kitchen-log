"use client"

import { IconCircleX } from "@tabler/icons-react"
import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Recipe } from "@/types/recipe/recipe"
import type {
  SetMealInput,
  SetMealState,
} from "@/types/set-meal/set-meal-input"

export default function RecipesInput({
  formData,
  setFormDataAction,
  state,
  recipes,
}: {
  formData: SetMealInput
  setFormDataAction: Dispatch<SetStateAction<SetMealInput>>
  state: SetMealState | undefined
  recipes: Recipe[]
}) {
  const [recipeSuggestions, setRecipeSuggestions] = useState<Recipe[]>([])
  const [inputValue, setInputValue] = useState("")

  function handleRemoveRecipe(id: number) {
    setFormDataAction({
      ...formData,
      recipes: formData.recipes.filter((r) => r.id !== id),
    })
  }

  function handleChange(value: string) {
    setInputValue(value)
    if (!value) {
      setRecipeSuggestions([])
      return
    }
    const filteredRecipes = recipes.filter((r) => r.title.includes(value))
    setRecipeSuggestions(filteredRecipes)
  }

  function handleSelect(recipe: Recipe) {
    if (formData.recipes.some((r) => r.id === recipe.id)) return

    setFormDataAction({
      ...formData,
      recipes: [...formData.recipes, recipe],
    })
    setInputValue("")
    setRecipeSuggestions([])
  }

  return (
    <AccordionContent className="grid gap-2 max-w-xl">
      <div className="w-full flex flex-col gap-2">
        <Input
          id="recipes"
          name="recipes"
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
        />

        {recipeSuggestions.length > 0 && (
          <ScrollArea className="h-72 w-full rounded-md border p-4">
            {recipeSuggestions.map((r) => (
              <div key={r.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(r)}
                  className="text-start w-full"
                >
                  {r.title}
                </button>
                <Separator className="my-2" />
              </div>
            ))}
          </ScrollArea>
        )}
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
