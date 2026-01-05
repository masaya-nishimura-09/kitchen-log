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
import type { SetMealSearch } from "@/types/set-meal/set-meal-search"
import TitleInput from "./title-input"

export default function SetMealSearchForm() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const [formData, setFormDataAction] = useState<SetMealSearch>({
    title: "",
    recipeTitle: "",
  })

  const handleSearch = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const query = {
      title: formData.title,
      recipeTitle: formData.recipeTitle,
    }

    const params = new URLSearchParams()

    params.append("title", query.title)
    params.append("recipe-title", query.recipeTitle)

    router.push(`/dashboard/set-meal?${params.toString()}`)
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
