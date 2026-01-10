"use client"

import Image from "next/image"
import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Item, ItemContent, ItemTitle } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AppActionResult } from "@/types/app-action-result"
import type { EventInput } from "@/types/calendar/event-input"
import type { Recipe } from "@/types/recipe/recipe"

export default function RecipeInput({
  formData,
  setFormDataAction,
  state,
  recipes,
}: {
  formData: EventInput
  setFormDataAction: Dispatch<SetStateAction<EventInput>>
  state: AppActionResult | undefined
  recipes: Recipe[]
}) {
  const [recipeSuggestions, setRecipeSuggestions] = useState<Recipe[]>([])
  const [inputValue, setInputValue] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

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
    setFormDataAction({
      ...formData,
      recipeId: recipe.id,
    })
    setInputValue("")
    setSelectedRecipe(recipe)
    setRecipeSuggestions([])
  }

  return (
    <div className="grid gap-2 max-w-lg">
      <div className="w-full flex flex-col gap-2">
        <Label htmlFor="recipes" className="px-1">
          レシピを選択してください
        </Label>
        <Input
          id="recipes"
          name="recipes"
          type="text"
          value={inputValue}
          placeholder="レシピ名を入力して、候補から選択してください。"
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
        {selectedRecipe && (
          <Item
            key={selectedRecipe.id}
            variant="outline"
            size="sm"
            className="py-2 flex gap-2"
          >
            <Image
              src={
                selectedRecipe.imageUrl
                  ? `/api/recipe-image?path=${selectedRecipe.imageUrl}`
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
                {selectedRecipe.title}
              </ItemTitle>
            </ItemContent>
          </Item>
        )}
      </div>

      <div aria-live="polite" aria-atomic="true">
        {state?.errors?.recipeId?.map((error: string) => (
          <p className="mt-2 text-red-500 text-sm" key={error}>
            {error}
          </p>
        ))}
      </div>
    </div>
  )
}
