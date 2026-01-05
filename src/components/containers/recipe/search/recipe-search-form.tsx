"use client"

import { IconAdjustmentsSearch } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Ingredient, Tag } from "@/types/recipe/recipe"
import type { RecipeSearch } from "@/types/recipe/recipe-search"
import IngredientInput from "./ingredient-input"
import TagInput from "./tag-input"
import TitleInput from "./title-input"

export default function RecipeSearchForm({
  ingredients,
  tags,
}: {
  ingredients: Ingredient[]
  tags: Tag[]
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const [formData, setFormDataAction] = useState<RecipeSearch>({
    title: "",
    ingredients: [],
    tags: [],
  })

  const handleSearch = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const query = {
      title: formData.title,
      ingredients: formData.ingredients.map((i) => i.name),
      tags: formData.tags.map((t) => t.name),
    }

    const params = new URLSearchParams()

    params.append("title", query.title)
    query.ingredients.forEach((i) => {
      params.append("ingredients", i)
    })
    query.tags.forEach((t) => {
      params.append("tags", t)
    })

    router.push(`/dashboard/recipe?${params.toString()}`)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        onClick={() => setIsOpen(true)}
        className="flex gap-2 items-center"
      >
        <Button variant="outline">
          <IconAdjustmentsSearch />
          詳細検索
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>詳細検索</DialogTitle>
        </DialogHeader>
        <form className="grid gap-6 mt-6">
          <TitleInput
            formData={formData}
            setFormDataAction={setFormDataAction}
          />
          <TagInput
            formData={formData}
            setFormDataAction={setFormDataAction}
            tags={tags}
          />
          <IngredientInput
            formData={formData}
            setFormDataAction={setFormDataAction}
            ingredients={ingredients}
          />
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSearch}>
            検索
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
