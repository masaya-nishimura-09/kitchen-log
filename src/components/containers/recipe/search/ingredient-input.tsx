"use client"

import { IconCircleX } from "@tabler/icons-react"
import { type Dispatch, type SetStateAction, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Ingredient } from "@/types/recipe/recipe"
import type { RecipeSearch } from "@/types/recipe/recipe-search"

export default function IngredientInput({
  formData,
  setFormDataAction,
  ingredients,
}: {
  formData: RecipeSearch
  setFormDataAction: Dispatch<SetStateAction<RecipeSearch>>
  ingredients: Ingredient[]
}) {
  const [ingredientsSuggestions, setIngredientsSuggestions] = useState<
    Ingredient[]
  >([])
  const [inputValue, setInputValue] = useState("")

  function handleChange(value: string) {
    setInputValue(value)
    if (!value) {
      setIngredientsSuggestions([])
      return
    }
    const filteredIngredients = ingredients.filter((t) =>
      t.name.includes(value),
    )
    setIngredientsSuggestions(filteredIngredients)
  }

  function handleSelect(ingredient: Ingredient) {
    if (formData.ingredients.some((i) => i.id === ingredient.id)) return

    setFormDataAction({
      ...formData,
      ingredients: [...formData.ingredients, ingredient],
    })
    setInputValue("")
    setIngredientsSuggestions([])
  }

  function handleRemoveTag(id: number) {
    setFormDataAction({
      ...formData,
      ingredients: formData.ingredients.filter((i) => i.id !== id),
    })
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="ingredient">材料</Label>
      <div>
        <Input
          id="ingredient"
          name="ingredient"
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="材料名を入力してください"
        />

        {ingredientsSuggestions.length > 0 && (
          <ScrollArea className="max-h-72 w-full rounded-md border p-4 mt-2">
            <div className="flex flex-col gap-2">
              {ingredientsSuggestions.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => handleSelect(i)}
                  className="text-start w-full"
                >
                  {i.name}
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="flex w-full flex-wrap gap-2">
        {formData.ingredients.map((i) => (
          <Badge key={i.id} variant="secondary">
            <div className="flex items-center gap-1">
              <span>{i.name}</span>
              <button
                type="button"
                className="rounded-full"
                onClick={() => handleRemoveTag(i.id)}
              >
                <IconCircleX size={18} />
              </button>
            </div>
          </Badge>
        ))}
      </div>
    </div>
  )
}
