"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth"
import { zenkakuToHankaku } from "@/lib/recipe/zenkaku-to-hankaku"
import { RecipeFormSchema } from "@/lib/schemas/recipe-form"
import { createClient } from "@/lib/supabase/server"
import type { RecipeInput, RecipeState } from "@/types/recipe/recipe-input"
import { uploadImage } from "./image"

export async function createRecipe(formData: FormData): Promise<RecipeState> {
  const recipeData = JSON.parse(
    formData.get("recipeData") as string,
  ) as RecipeInput

  const validatedFields = RecipeFormSchema.safeParse({
    id: recipeData.id,
    imageUrl: recipeData.imageUrl,
    image: formData.get("image") as File | null,
    title: recipeData.title,
    memo: recipeData.memo,
    tag: recipeData.tag,
    ingredient: recipeData.ingredient,
    step: recipeData.step,
  })

  if (!validatedFields.success) {
    console.error(validatedFields.error)
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }
  const { image, title, memo, tag, ingredient, step } = validatedFields.data
  const userId = await getUserId()
  if (!userId) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }

  let imageUrl: string | null = null
  if (image) {
    const { url, error } = await uploadImage(image, userId)
    imageUrl = url
    if (error) {
      console.warn("画像アップロードに失敗しましたが処理を続行します:", error)
    }
  }

  const convertedIngredients = ingredient.map((i) => ({
    ...i,
    amount: zenkakuToHankaku(i.amount),
  }))

  const supabase = createClient(cookies())

  const { data, error } = await supabase
    .rpc("add_recipe_with_details", {
      p_user_id: userId,
      p_title: title,
      p_image_url: imageUrl,
      p_memo: memo,
      p_tags: tag,
      p_ingredients: convertedIngredients,
      p_steps: step,
    })
    .single<{ id: number }>()

  if (error || !data) {
    console.error("Recipe insert failed:", error)
    return {
      success: false,
      message: "データベースへの保存に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/recipe/${data.id}`)
}
