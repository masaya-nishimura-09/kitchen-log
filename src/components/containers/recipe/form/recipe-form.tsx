"use client"

import { IconTrash } from "@tabler/icons-react"
import Link from "next/link"
import { useState, useTransition } from "react"
import { createRecipe } from "@/actions/recipe/create"
import { deleteRecipe } from "@/actions/recipe/delete"
import { editRecipe } from "@/actions/recipe/edit"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { AppActionResult } from "@/types/app-action-result"
import type { RecipeInput } from "@/types/recipe/recipe-input"
import IngredientInput from "./inputs/ingredient"
import StepInput from "./inputs/step"
import TagInput from "./inputs/tag"

export default function RecipeForm({
  recipe,
  mode,
}: {
  recipe: RecipeInput | null
  mode: string
}) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<AppActionResult>({
    success: false,
  })

  const [formData, setFormDataAction] = useState<RecipeInput>({
    id: recipe?.id || 0,
    image: null,
    imageUrl: recipe?.imageUrl || "",
    title: recipe?.title || "",
    memo: recipe?.memo || "",
    tag: recipe?.tag || [],
    ingredient: recipe?.ingredient || [],
    step: recipe?.step || [],
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
        id: formData.id,
        imageUrl: formData.imageUrl,
        title: formData.title,
        memo: formData.memo,
        tag: formData.tag,
        ingredient: formData.ingredient,
        step: formData.step,
      }),
    )

    if (mode === "new") {
      startTransition(async () => {
        const result = await createRecipe(fd)
        if (!result.success) {
          setState(result)
        }
      })
    } else {
      startTransition(async () => {
        const result = await editRecipe(fd)
        if (!result.success) {
          setState(result)
        }
      })
    }
  }

  return (
    <Card className="size-full">
      <CardHeader>
        {mode === "new" ? (
          <CardTitle>新規レシピ</CardTitle>
        ) : (
          <CardTitle>レシピを編集</CardTitle>
        )}
        {mode === "edit" && (
          <CardAction>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center">
                  <IconTrash />
                  レシピを削除
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>レシピの削除</AlertDialogTitle>
                  <AlertDialogDescription>
                    このレシピを本当に削除してもよろしいですか？
                    この操作は元に戻せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      startTransition(async () => {
                        const result = await deleteRecipe(formData.id)
                        if (!result.success) {
                          console.error(result.message)
                        }
                      })
                    }}
                  >
                    {isPending && <Spinner />}
                    OK
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <form
          id="new-recipe-form"
          className="max-w-xl flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-2">
            <Label>写真</Label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={(e) =>
                setFormDataAction({
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
          </div>

          <div className="grid gap-2">
            <Label>タイトル</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="タイトルを入力してください"
              value={formData.title}
              onChange={(e) =>
                setFormDataAction({ ...formData, title: e.target.value })
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
            <Label>メモ</Label>
            <Textarea
              id="memo"
              name="memo"
              placeholder="メモすることがある場合入力してください"
              value={formData.memo}
              onChange={(e) =>
                setFormDataAction({ ...formData, memo: e.target.value })
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
            setFormDataAction={setFormDataAction}
            state={state}
          />

          <IngredientInput
            formData={formData}
            setFormDataAction={setFormDataAction}
            state={state}
          />

          <StepInput
            formData={formData}
            setFormDataAction={setFormDataAction}
            state={state}
          />

          <div aria-live="polite" aria-atomic="true">
            {state?.message && (
              <p className="mt-2 text-red-500 text-sm">{state.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button type="submit" form="new-recipe-form" disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "登録中..." : "登録"}
        </Button>
        <Button type="button" variant="outline" disabled={isPending}>
          {mode === "new" ? (
            <Link href="/dashboard/recipe">キャンセル</Link>
          ) : (
            <Link href={`/dashboard/recipe/${formData.id}`}>キャンセル</Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
