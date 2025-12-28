"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth"
import { SetMealFormSchema } from "@/lib/schemas/set-meal-form"
import { createClient } from "@/lib/supabase/server"
import type { SetMealInput, SetMealState } from "@/types/set-meal/set-meal-input"

export async function editSetMeal(formData: FormData): Promise<SetMealState> {
  const setMealData = JSON.parse(
    formData.get("setMealData") as string,
  ) as SetMealInput

  const validatedFields = SetMealFormSchema.safeParse({
    id: setMealData.id,
    title: setMealData.title,
    memo: setMealData.memo,
    recipes: setMealData.recipes,
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }
  const { id, title, memo, recipes } = validatedFields.data

  const userId = await getUserId()
  if (!userId) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }

  const supabase = createClient(cookies())

  const { error } = await supabase
    .rpc("edit_set_meal_with_details", {
      p_id: id,
      p_user_id: userId,
      p_title: title,
      p_memo: memo,
      p_recipes: recipes,
    })
    .single<{ id: number }>()

  if (error) {
    console.error("Set meal update failed:", error)
    return {
      success: false,
      message: "データベースの更新に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/set-meal/${id}`)
}
