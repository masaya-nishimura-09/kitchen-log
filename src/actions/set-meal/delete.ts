"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth"
import { createClient } from "@/lib/supabase/server"
import type { SetMealState } from "@/types/set-meal/set-meal-input"

export async function deleteSetMeal(id: number): Promise<SetMealState> {
  const userId = await getUserId()
  if (!userId) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }

  const supabase = createClient(cookies())
  const { error: deleteSetMealError } = await supabase
    .from("set_meals")
    .delete()
    .eq("id", id)
    .select()
    .single()

  if (deleteSetMealError) {
    console.error("Set meal delete failed:", deleteSetMealError)
    return {
      success: false,
      message: "献立の削除に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/set-meal`)
}
