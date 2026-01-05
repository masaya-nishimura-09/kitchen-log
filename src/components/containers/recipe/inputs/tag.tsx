"use client"

import { IconCircleX } from "@tabler/icons-react"
import { type Dispatch, type SetStateAction, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { RecipeInput, RecipeState } from "@/types/recipe/recipe-input"

export default function TagInput({
  formData,
  setFormDataAction,
  state,
}: {
  formData: RecipeInput
  setFormDataAction: Dispatch<SetStateAction<RecipeInput>>
  state: RecipeState | undefined
}) {
  const [inputValue, setInputValue] = useState("")

  function handleAddTag() {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    if (formData.tag.some((t) => t.name === trimmed)) return

    setFormDataAction({
      ...formData,
      tag: [...formData.tag, { name: trimmed }],
    })
    setInputValue("")
  }

  function handleRemoveTag(name: string) {
    setFormDataAction({
      ...formData,
      tag: formData.tag.filter((t) => t.name !== name),
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="grid gap-2 w-full">
      <div className="flex w-full items-center gap-2">
        <Input
          id="tag"
          name="tag"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="タグを入力してください"
        />
        <Button type="button" variant="outline" onClick={handleAddTag}>
          追加
        </Button>
      </div>

      <div className="flex w-full flex-wrap gap-2">
        {formData.tag.map((t, index) => (
          <Badge key={`${t.name}-${index}`} variant="secondary">
            <div className="flex items-center gap-1">
              <span>{t.name}</span>
              <button
                type="button"
                className="rounded-full"
                onClick={() => handleRemoveTag(t.name)}
              >
                <IconCircleX size={18} />
              </button>
            </div>
          </Badge>
        ))}
      </div>

      <div aria-live="polite" aria-atomic="true">
        {state?.errors?.tag?.map((error: string) => (
          <p className="mt-2 text-red-500 text-sm" key={error}>
            {error}
          </p>
        ))}
      </div>
    </div>
  )
}
