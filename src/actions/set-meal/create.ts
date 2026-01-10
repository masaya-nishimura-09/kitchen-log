"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth/auth"
import { SetMealFormSchema } from "@/lib/schemas/set-meal-form"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
import type { SetMealInput } from "@/types/set-meal/set-meal-input"

export async function createSetMeal(
  formData: FormData,
): Promise<AppActionResult> {
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
    console.error(validatedFields.error)
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }
  const { title, memo, recipes } = validatedFields.data
  const getUserIdResult = await getUserId()
  if (!getUserIdResult.success || !getUserIdResult.data) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }
  const userId = getUserIdResult.data

  const supabase = createClient(cookies())
  const { data, error } = await supabase
    .rpc("add_set_meal_with_details", {
      p_user_id: userId,
      p_title: title,
      p_memo: memo,
      p_recipes: recipes,
    })
    .single<{ id: number }>()

  if (error || !data) {
    console.error("Set meal insert failed:", error)
    return {
      success: false,
      message: "データベースへの保存に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/set-meal/${data.id}`)
}
