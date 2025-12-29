"use client"

import { IconCircleX } from "@tabler/icons-react"
import Image from "next/image"
import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { AccordionContent } from "@/components/ui/accordion"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
          <ScrollArea className="max-h-72 w-full rounded-md border p-4">
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

      <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
        {formData.recipes.map((recipe) => (
          <Card key={recipe.id} className="aspect-video py-2">
            <CardContent className="flex flex-col gap-2">
              <button
                type="button"
                className="block ml-auto rounded-full"
                onClick={() => handleRemoveRecipe(recipe.id)}
              >
                <IconCircleX size={20} />
              </button>
              {recipe.imageUrl ? (
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                  <Image
                    src={`/api/recipe-image?path=${recipe.imageUrl}`}
                    alt="recipe image"
                    width={500}
                    height={300}
                    className="h-full w-full rounded-lg object-cover"
                    unoptimized
                  />
                </AspectRatio>
              ) : (
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                  <Image
                    src="/image-not-found/cover.png"
                    alt="recipe image"
                    width={500}
                    height={300}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </AspectRatio>
              )}
            </CardContent>
            <CardHeader>
              <CardTitle className="whitespace-nowrap overflow-hidden text-ellipsis">
                {recipe.title}
              </CardTitle>
            </CardHeader>
          </Card>
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
