"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { createSetMeal } from "@/actions/set-meal/create"
import { deleteSetMeal } from "@/actions/set-meal/delete"
import { editSetMeal } from "@/actions/set-meal/edit"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { Recipe } from "@/types/recipe/recipe"
import type {
  SetMealInput,
  SetMealState,
} from "@/types/set-meal/set-meal-input"
import RecipesInput from "./recipes-input"

export default function SetMealForm({
  setMeal,
  mode,
  recipes,
}: {
  setMeal: SetMealInput | null
  mode: string
  recipes: Recipe[]
}) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<SetMealState>({
    success: true,
    message: null,
    errors: {},
  })

  const [formData, setFormDataAction] = useState<SetMealInput>({
    id: setMeal?.id || 0,
    title: setMeal?.title || "",
    memo: setMeal?.memo || "",
    recipes: setMeal?.recipes || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fd = new FormData()
    fd.append(
      "setMealData",
      JSON.stringify({
        id: formData.id,
        title: formData.title,
        memo: formData.memo,
        recipes: formData.recipes,
      }),
    )

    if (mode === "new") {
      startTransition(async () => {
        const result = await createSetMeal(fd)
        if (!result.success) {
          setState(result)
        }
      })
    } else {
      startTransition(async () => {
        const result = await editSetMeal(fd)
        if (!result.success) {
          setState(result)
        }
      })
    }
  }

  return (
    <div className="size-full">
      <Card className="size-full">
        <CardHeader>
          {mode === "new" ? (
            <CardTitle>新規献立</CardTitle>
          ) : (
            <CardTitle>献立を編集</CardTitle>
          )}
          {mode === "edit" && (
            <CardAction>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">献立を削除</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>献立の削除</AlertDialogTitle>
                    <AlertDialogDescription>
                      この献立を本当に削除してもよろしいですか？
                      この操作は元に戻せません。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteSetMeal(formData.id)
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
            id="new-set-meal-form"
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="title"
            >
              <AccordionItem value="title">
                <AccordionTrigger>タイトル</AccordionTrigger>
                <AccordionContent className="grid gap-2 max-w-lg">
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
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="memo">
                <AccordionTrigger>メモ</AccordionTrigger>
                <AccordionContent className="grid gap-2 max-w-lg">
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
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="recipes">
                <AccordionTrigger>レシピ</AccordionTrigger>
                <RecipesInput
                  formData={formData}
                  setFormDataAction={setFormDataAction}
                  state={state}
                  recipes={recipes}
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
        <CardFooter className="flex gap-2">
          <Button type="submit" form="new-set-meal-form" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "登録中..." : "登録"}
          </Button>
          <Button type="button" variant="outline" disabled={isPending}>
            {mode === "new" ? (
              <Link href="/dashboard/set-meal">キャンセル</Link>
            ) : (
              <Link href={`/dashboard/set-meal/${formData.id}`}>
                キャンセル
              </Link>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
