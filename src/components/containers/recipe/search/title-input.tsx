"use client"

import { IconCircleX } from "@tabler/icons-react"
import { type Dispatch, type SetStateAction, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RecipeSearch } from "@/types/recipe/recipe-search"

export default function TitleInput({
  formData,
  setFormDataAction,
}: {
  formData: RecipeSearch
  setFormDataAction: Dispatch<SetStateAction<RecipeSearch>>
}) {
  const [inputValue, setInputValue] = useState("")

  function handleAdd() {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    if (formData.title.some((t) => t === trimmed)) return

    setFormDataAction({
      ...formData,
      title: [...formData.title, trimmed],
    })
    setInputValue("")
  }

  function handleRemove(name: string) {
    setFormDataAction({
      ...formData,
      title: formData.title.filter((t) => t !== name),
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="title">タイトル</Label>
      <div className="flex w-full items-center gap-2">
        <Input
          id="title"
          name="title"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="タイトルのキーワードを入力してください"
        />
        <Button type="button" variant="outline" onClick={handleAdd}>
          追加
        </Button>
      </div>

      <div className="flex w-full flex-wrap gap-2">
        {formData.title.map((t) => (
          <Badge key={t} variant="secondary">
            <div className="flex items-center gap-1">
              <span>{t}</span>
              <button
                type="button"
                className="rounded-full"
                onClick={() => handleRemove(t)}
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
