"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth/auth"
import { RecipeSchema } from "@/lib/recipe/recipe-schema"
import { createClient } from "@/lib/supabase/server"
import { zenkakuToHankaku } from "@/lib/zenkaku-to-hankaku"
import type { AppActionResult } from "@/types/app-action-result"
import type { RecipeInput } from "@/types/recipe/recipe-input"
import { deleteImage, uploadImage } from "./image"

export async function editRecipe(formData: FormData): Promise<AppActionResult> {
  const recipeData = JSON.parse(
    formData.get("recipeData") as string,
  ) as RecipeInput

  const validatedFields = RecipeSchema.safeParse({
    id: recipeData.id,
    image: formData.get("image") as File | null,
    imageUrl: recipeData.imageUrl,
    title: recipeData.title,
    memo: recipeData.memo,
    tag: recipeData.tag,
    ingredient: recipeData.ingredient,
    step: recipeData.step,
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }
  const { id, image, title, memo, tag, ingredient, step } = validatedFields.data
  let { imageUrl } = validatedFields.data

  const getUserIdResult = await getUserId()
  if (!getUserIdResult.success || !getUserIdResult.data) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }
  const userId = getUserIdResult.data

  if (image) {
    if (imageUrl) {
      const result = await deleteImage(imageUrl)
      if (!result.success) {
        return {
          success: false,
          message: "画像の削除に失敗しました",
        }
      }
    }

    const result = await uploadImage(image, userId)
    if (!result.success || !result.data) {
      return {
        success: false,
        message: "画像アップロードに失敗しました。",
      }
    }
    imageUrl = result.data
  }

  const convertedIngredients = ingredient.map((i) => ({
    ...i,
    amount: zenkakuToHankaku(i.amount),
  }))

  const supabase = createClient(cookies())

  const { error } = await supabase
    .rpc("edit_recipe_with_details", {
      p_id: id,
      p_user_id: userId,
      p_title: title,
      p_image_url: imageUrl,
      p_memo: memo,
      p_tags: tag,
      p_ingredients: convertedIngredients,
      p_steps: step,
    })
    .single<{ id: number }>()

  if (error) {
    return {
      success: false,
      message: "データベースの更新に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/recipe/${id}`)
}
