"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { RecipeFormSchema } from "@/lib/schemas/recipe-form"
import { createClient } from "@/lib/supabase/server"
import type { Recipe } from "@/types/recipe/recipe"
import type { RecipeInput, RecipeState } from "@/types/recipe/recipe-input"
import { getUserId } from "./auth"

async function uploadImage(
  file: File,
  userId: string,
): Promise<{ url: string | null; error?: string }> {
  try {
    const supabase = createClient(cookies())

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("recipe-images")
      .upload(`${userId}/${Date.now()}-${file.name}`, file)

    if (uploadError) {
      console.error("Supabase upload error:", uploadError)
      return { url: null, error: uploadError.message }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("recipe-images").getPublicUrl(uploadData.path)

    return { url: publicUrl }
  } catch (error) {
    console.error("Image upload failed:", error)
    return {
      url: null,
      error:
        error instanceof Error
          ? error.message
          : "画像アップロードに失敗しました",
    }
  }
}

export async function addRecipe(formData: FormData): Promise<RecipeState> {
  const recipeData = JSON.parse(
    formData.get("recipeData") as string,
  ) as RecipeInput

  const validatedFields = RecipeFormSchema.safeParse({
    image: formData.get("image") as File | null,
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

  const supabase = createClient(cookies())

  const { data, error } = await supabase.rpc("add_recipe_with_details", {
    p_user_id: userId,
    p_title: title,
    p_image_url: imageUrl,
    p_memo: memo,
    p_tags: tag,
    p_ingredients: ingredient,
    p_steps: step,
  })

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

export default async function fetchRecipe(recipeId: number): Promise<Recipe> {
  const userId = await getUserId()
  if (!userId) {
    throw new Error(
      "認証情報が取得できませんでした。再度ログインしてください。",
    )
  }

  const supabase = createClient(cookies())
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      id,
      user_id,
      title,
      image_url,
      memo,
      updated_at,
      created_at,
      tags (
        id,
        recipe_id,
        user_id,
        name,
        updated_at,
        created_at
      ),
      ingredients (
        id,
        recipe_id,
        user_id,
        name,
        amount,
        unit,
        order,
        updated_at,
        created_at
      ),
      steps (
        id,
        recipe_id,
        user_id,
        text,
        order,
        updated_at,
        created_at
      )`,
    )
    .eq("user_id", userId)
    .eq("id", recipeId)
    .single()

  if (error) {
    console.error("Recipe Fetch Failed:", error)
    throw new Error("レシピの取得に失敗しました。")
  }

  if (!data) {
    throw new Error("レシピの取得に失敗しました。")
  } else {
    const convertedData = {
      id: data.id as number,
      userId: data.user_id as string,
      title: data.title as string,
      imageUrl: data.image_url as string | null,
      memo: data.memo as string | null,
      updatedAt: data.updated_at as string,
      createdAt: data.created_at as string,
      tag: data.tags.map((t) => ({
        id: t.id as number,
        recipeId: t.recipe_id as number,
        userId: t.user_id as string,
        name: t.name as string,
        updatedAt: t.updated_at as string,
        createdAt: t.created_at as string,
      })),
      ingredient: data.ingredients
        .map((i) => ({
          id: i.id as number,
          recipeId: i.recipe_id as number,
          userId: i.user_id as string,
          name: i.name as string,
          amount: i.amount as string,
          unit: i.unit as string,
          order: i.order as number,
          updatedAt: i.updated_at as string,
          createdAt: i.created_at as string,
        }))
        .sort((a, b) => a.order - b.order),
      step: data.steps
        .map((s) => ({
          id: s.id as number,
          recipeId: s.recipe_id as number,
          userId: s.user_id as string,
          text: s.text as string,
          order: s.order as number,
          updatedAt: s.updated_at as string,
          createdAt: s.created_at as string,
        }))
        .sort((a, b) => a.order - b.order),
    }

    return convertedData
  }
}
