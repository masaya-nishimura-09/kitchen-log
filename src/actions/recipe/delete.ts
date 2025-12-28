"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth"
import { createClient } from "@/lib/supabase/server"
import type { RecipeState } from "@/types/recipe/recipe-input"
import { deleteImage } from "./image"

export async function deleteRecipe(id: number): Promise<RecipeState> {
  const userId = await getUserId()
  if (!userId) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }

  const supabase = createClient(cookies())
  const { data, error: deleteRecipeError } = await supabase
    .from("recipes")
    .delete()
    .eq("id", id)
    .select()
    .single()

  if (deleteRecipeError) {
    console.error("Recipe delete failed:", deleteRecipeError)
    return {
      success: false,
      message: "レシピの削除に失敗しました。",
    }
  }

  if (data.imageUrl) {
    const error = await deleteImage(data.imageUrl)
    if (error) {
      console.warn("画像の削除に失敗しました:", error)
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/recipe`)
}
