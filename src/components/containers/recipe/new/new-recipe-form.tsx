"use client"

import { useState, useTransition } from "react"
import { addRecipe } from "@/actions/recipe"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { RecipeInput, RecipeState } from "@/types/recipe/recipe-input"
import IngredientInput from "./ingredient-input"
import StepInput from "./step-input"
import TagInput from "./tag-input"

export default function NewRecipeForm() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<RecipeState>({
    success: true,
    message: null,
    errors: {},
  })

  const [formData, setFormData] = useState<RecipeInput>({
    image: null,
    title: "",
    memo: "",
    tag: [],
    ingredient: [],
    step: [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fd = new FormData()

    if (formData.image) {
      fd.append("image", formData.image)
    }

    fd.append(
      "recipeData",
      JSON.stringify({
        title: formData.title,
        memo: formData.memo,
        tag: formData.tag,
        ingredient: formData.ingredient,
        step: formData.step,
      }),
    )

    startTransition(async () => {
      const result = await addRecipe(fd)
      if (!result.success) {
        setState(result)
      }
    })
  }

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>新規レシピ</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="new-recipe-form"
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="image"
          >
            <AccordionItem value="image">
              <AccordionTrigger>写真</AccordionTrigger>
              <AccordionContent className="grid gap-2 max-w-xl">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files?.[0] || null,
                    })
                  }
                />
                <div aria-live="polite" aria-atomic="true">
                  {state?.errors?.image?.map((error: string) => (
                    <p className="mt-2 text-red-500 text-sm" key={error}>
                      {error}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="title">
              <AccordionTrigger>タイトル</AccordionTrigger>
              <AccordionContent className="grid gap-2 max-w-xl">
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="タイトルを入力してください"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <div aria-live="polite" aria-atomic="true">
                  {state?.errors?.title?.map((error: string) => (
                    <p className="mt-2 text-red-500 text-sm" key={error}>
                      {error}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="memo">
              <AccordionTrigger>メモ</AccordionTrigger>
              <AccordionContent className="grid gap-2 max-w-xl">
                <Textarea
                  id="memo"
                  name="memo"
                  placeholder="メモすることがある場合入力してください"
                  value={formData.memo}
                  onChange={(e) =>
                    setFormData({ ...formData, memo: e.target.value })
                  }
                />
                <div aria-live="polite" aria-atomic="true">
                  {state?.errors?.memo?.map((error: string) => (
                    <p className="mt-2 text-red-500 text-sm" key={error}>
                      {error}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tag">
              <AccordionTrigger>タグ</AccordionTrigger>
              <TagInput
                formData={formData}
                setFormData={setFormData}
                state={state}
              />
            </AccordionItem>

            <AccordionItem value="ingredient">
              <AccordionTrigger>材料</AccordionTrigger>
              <IngredientInput
                formData={formData}
                setFormData={setFormData}
                state={state}
              />
            </AccordionItem>

            <AccordionItem value="step">
              <AccordionTrigger>手順</AccordionTrigger>
              <StepInput
                formData={formData}
                setFormData={setFormData}
                state={state}
              />
            </AccordionItem>
          </Accordion>

          <div aria-live="polite" aria-atomic="true">
            {state?.message && (
              <p className="mt-2 text-red-500 text-sm">{state.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="new-recipe-form" disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "登録中..." : "登録"}
        </Button>
      </CardFooter>
    </Card>
  )
}
