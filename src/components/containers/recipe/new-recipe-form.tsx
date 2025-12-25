"use client"

import { useActionState, useState } from "react"
import { addRecipe } from "@/actions/recipe"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { RecipeInput, RecipeState } from "@/types/recipe/recipe-input"
import IngredientInput from "./ingredient-input"
import StepInput from "./step-input"
import TagInput from "./tag-input"

export default function NewRecipeForm() {
  const initialState: RecipeState = { message: null, errors: {} }
  const [state, formAction, isPending] = useActionState(addRecipe, initialState)

  const [formData, setFormData] = useState<RecipeInput>({
    image: null,
    title: "",
    memo: "",
    tag: [],
    ingredient: [],
    step: [],
  })

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>新規レシピ</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="new-recipe-form"
          action={formAction}
          className="flex flex-col gap-6"
        >
          <div className="grid gap-2">
            <Label htmlFor="image">写真</Label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files?.[0] || null })
              }
            />
            <div aria-live="polite" aria-atomic="true">
              {state?.errors?.image?.map((error: string) => (
                <p className="mt-2 text-red-500 text-sm" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              name="title"
              type="text"
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="memo">メモ</Label>
            <Textarea
              id="memo"
              name="memo"
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
          </div>

          <TagInput
            formData={formData}
            setFormData={setFormData}
            state={state}
          />

          <IngredientInput
            formData={formData}
            setFormData={setFormData}
            state={state}
          />

          <StepInput
            formData={formData}
            setFormData={setFormData}
            state={state}
          />

          <div aria-live="polite" aria-atomic="true">
            {state?.message && (
              <p className="mt-2 text-red-500 text-sm">{state.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          type="submit"
          className="w-full"
          form="new-recipe-form"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          {isPending ? "登録中..." : "登録"}
        </Button>
      </CardFooter>
    </Card>
  )
}
