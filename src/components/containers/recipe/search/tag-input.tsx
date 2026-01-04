"use client"

import { IconCircleX } from "@tabler/icons-react"
import { type Dispatch, type SetStateAction, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Tag } from "@/types/recipe/recipe"
import type { RecipeSearch } from "@/types/recipe/recipe-search"

export default function TagInput({
  formData,
  setFormDataAction,
  tags,
}: {
  formData: RecipeSearch
  setFormDataAction: Dispatch<SetStateAction<RecipeSearch>>
  tags: Tag[]
}) {
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([])
  const [inputValue, setInputValue] = useState("")

  function handleChange(value: string) {
    setInputValue(value)
    if (!value) {
      setTagSuggestions([])
      return
    }
    const filteredTags = tags.filter((t) => t.name.includes(value))
    setTagSuggestions(filteredTags)
  }

  function handleSelect(tag: Tag) {
    if (formData.tags.some((t) => t.id === tag.id)) return

    setFormDataAction({
      ...formData,
      tags: [...formData.tags, tag],
    })
    setInputValue("")
    setTagSuggestions([])
  }

  function handleRemoveTag(id: number) {
    setFormDataAction({
      ...formData,
      tags: formData.tags.filter((t) => t.id !== id),
    })
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="tag">タグ</Label>
      <div>
        <Input
          id="tag"
          name="tag"
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="タグを入力してください"
        />

        {tagSuggestions.length > 0 && (
          <ScrollArea className="max-h-72 w-full rounded-md border p-4 mt-2">
            <div className="flex flex-col gap-2">
              {tagSuggestions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelect(t)}
                  className="text-start w-full"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="flex w-full flex-wrap gap-2">
        {formData.tags.map((t) => (
          <Badge key={t.id} variant="secondary">
            <div className="flex items-center gap-1">
              <span>{t.name}</span>
              <button
                type="button"
                className="rounded-full"
                onClick={() => handleRemoveTag(t.id)}
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
