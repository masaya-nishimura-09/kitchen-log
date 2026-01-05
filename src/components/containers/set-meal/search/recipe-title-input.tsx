"use client"

import type { Dispatch, SetStateAction } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SetMealSearch } from "@/types/set-meal/set-meal-search"

export default function RecipeTitleInput({
  formData,
  setFormDataAction,
}: {
  formData: SetMealSearch
  setFormDataAction: Dispatch<SetStateAction<SetMealSearch>>
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="recipe-title">レシピのタイトル</Label>
      <Input
        id="recipe-title"
        name="recipe-title"
        type="text"
        value={formData.recipeTitle}
        onChange={(e) =>
          setFormDataAction({
            ...formData,
            recipeTitle: e.target.value,
          })
        }
        placeholder="レシピタイトルのキーワードを入力してください"
      />
    </div>
  )
}
