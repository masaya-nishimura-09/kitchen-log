"use client"

import type { Dispatch, SetStateAction } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SetMealSearch } from "@/types/set-meal/set-meal-search"

export default function TitleInput({
  formData,
  setFormDataAction,
}: {
  formData: SetMealSearch
  setFormDataAction: Dispatch<SetStateAction<SetMealSearch>>
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="title">タイトル</Label>
      <Input
        id="title"
        name="title"
        type="text"
        value={formData.title}
        onChange={(e) =>
          setFormDataAction({
            ...formData,
            title: e.target.value,
          })
        }
        placeholder="タイトルのキーワードを入力してください"
      />
    </div>
  )
}
