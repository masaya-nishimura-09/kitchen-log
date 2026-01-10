"use client"

import { IconCircleX } from "@tabler/icons-react"
import Image from "next/image"
import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { AccordionContent } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AppActionResult } from "@/types/app-action-result"
import type { Recipe } from "@/types/recipe/recipe"
import type { SetMealInput } from "@/types/set-meal/set-meal-input"

export default function RecipesInput({
  formData,
  setFormDataAction,
  state,
  recipes,
}: {
  formData: SetMealInput
  setFormDataAction: Dispatch<SetStateAction<SetMealInput>>
  state: AppActionResult | undefined
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
    <AccordionContent className="grid gap-2 max-w-lg">
      <div className="w-full flex flex-col gap-2">
        <Input
          id="recipes"
          name="recipes"
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
        />

        {recipeSuggestions.length > 0 && (
          <ScrollArea className="max-h-72 w-full rounded-md border p-4">
            <div className="flex flex-col gap-2">
              {recipeSuggestions.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelect(r)}
                  className="text-start w-full"
                >
                  {r.title}
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="w-full flex flex-col gap-2">
        {formData.recipes.map((recipe) => (
          <Item
            key={recipe.id}
            variant="outline"
            size="sm"
            className="py-2 flex gap-2"
          >
            <Image
              src={
                recipe.imageUrl
                  ? `/api/recipe-image?path=${recipe.imageUrl}`
                  : "/image-not-found/cover.png"
              }
              alt="recipe image"
              width={50}
              height={30}
              className="rounded-md object-cover aspect-video"
              unoptimized
            />
            <ItemContent>
              <ItemTitle className="whitespace-nowrap overflow-hidden text-ellipsis">
                {recipe.title}
              </ItemTitle>
            </ItemContent>
            <ItemActions>
              <button
                type="button"
                className="rounded-full shrink-0"
                onClick={() => handleRemoveRecipe(recipe.id)}
              >
                <IconCircleX size={18} />
              </button>
            </ItemActions>
          </Item>
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
