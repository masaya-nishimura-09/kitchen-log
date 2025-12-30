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
    throw new Error(
      "認証情報が取得できませんでした。再度ログインしてください。",
    )
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
    throw new Error("レシピの削除に失敗しました。")
  }

  if (data.imageUrl) {
    try {
      await deleteImage(data.imageUrl)
    } catch (error) {
      console.warn("画像の削除に失敗しました:", error)
      throw new Error("画像の削除に失敗しました")
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/recipe`)
}
