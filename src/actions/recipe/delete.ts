"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth/auth"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
import { deleteImage } from "./image"

export async function deleteRecipe(id: number): Promise<AppActionResult> {
  const getUserIdResult = await getUserId()
  if (!getUserIdResult.success || !getUserIdResult.data) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }
  const userId = getUserIdResult.data

  const supabase = createClient(cookies())
  const { data, error: deleteRecipeError } = await supabase
    .from("recipes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (deleteRecipeError) {
    return {
      success: false,
      message: "レシピの削除に失敗しました。",
    }
  }

  if (data.imageUrl) {
    const result = await deleteImage(data.imageUrl)
    if (!result.success) {
      return {
        success: false,
        message: "画像の削除に失敗しました",
      }
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/recipe`)
}
