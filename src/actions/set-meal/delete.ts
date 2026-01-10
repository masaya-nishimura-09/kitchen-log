"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth/auth"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"

export async function deleteSetMeal(id: number): Promise<AppActionResult> {
  const getUserIdResult = await getUserId()
  if (!getUserIdResult.success || !getUserIdResult.data) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }
  const userId = getUserIdResult.data

  const supabase = createClient(cookies())
  const { error } = await supabase
    .from("set_meals")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    return {
      success: false,
      message: "献立の削除に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/set-meal`)
}
