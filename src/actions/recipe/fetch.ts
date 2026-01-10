"use server"

import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth/auth"
import { ingredientConverter } from "@/lib/recipe/ingredient-converter"
import { recipeConverter } from "@/lib/recipe/recipe-converter"
import { tagConverter } from "@/lib/recipe/tag-converter"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
import type { Ingredient, Recipe, Tag } from "@/types/recipe/recipe"
import type { RecipeInput } from "@/types/recipe/recipe-input"
import type { RecipeSearchParams } from "@/types/recipe/recipe-search-params"

export async function fetchRecipe(
  recipeId: number,
): Promise<AppActionResult<Recipe>> {
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
    return {
      success: false,
      message: "レシピの取得に失敗しました。",
    }
  }

  return {
    success: true,
    data: recipeConverter(data),
  }
}

export async function fetchRecipes(
  searchParams: RecipeSearchParams | undefined,
): Promise<AppActionResult<Recipe[]>> {
  const getUserIdResult = await getUserId()
  if (!getUserIdResult.success || !getUserIdResult.data) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }
  const userId = getUserIdResult.data

  const titleParam = searchParams?.title || null

  let ingredientParam = searchParams?.ingredients || []
  if (!Array.isArray(ingredientParam)) {
    ingredientParam = [ingredientParam]
  }

  let tagParam = searchParams?.tags || []
  if (!Array.isArray(tagParam)) {
    tagParam = [tagParam]
  }

  const supabase = createClient(cookies())
  const { data, error } = await supabase.rpc("search_recipes", {
    p_user_id: userId,
    p_title: titleParam,
    p_ingredients: ingredientParam,
    p_tags: tagParam,
  })

  if (error) {
    return {
      success: false,
      message: "レシピの取得に失敗しました。",
    }
  }

  return {
    success: true,
    data: data?.map(recipeConverter),
  }
}

export async function fetchRecipeInput(
  recipeId: number,
): Promise<AppActionResult<RecipeInput>> {
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
    return {
      success: false,
      message: "レシピの取得に失敗しました。",
    }
  }

  const convertedData = recipeConverter(data)
  const recipeInput = {
    id: convertedData.id,
    image: null,
    imageUrl: convertedData.imageUrl,
    title: convertedData.title,
    memo: convertedData.memo || "",
    tag: convertedData.tag.map((t) => ({ name: t.name })),
    ingredient: convertedData.ingredient.map((i) => ({
      id: crypto.randomUUID(),
      name: i.name,
      amount: i.amount,
      unit: i.unit,
      order: i.order,
    })),
    step: convertedData.step.map((s) => ({
      id: crypto.randomUUID(),
      text: s.text,
      order: s.order,
    })),
  } as RecipeInput

  return {
    success: true,
    data: recipeInput,
  }
}

export async function fetchLatestRecipes(
  limit: number,
): Promise<AppActionResult<Recipe[]>> {
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
    .order("updated_at", { ascending: false })
    .limit(limit)

  if (error) {
    return {
      success: false,
      message: "レシピの取得に失敗しました。",
    }
  }

  return {
    success: true,
    data: data?.map(recipeConverter),
  }
}

export async function fetchIngredients(): Promise<
  AppActionResult<Ingredient[]>
> {
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
    .from("ingredients")
    .select()
    .eq("user_id", userId)

  if (error) {
    return {
      success: false,
      message: "材料の取得に失敗しました。",
    }
  }

  return {
    success: false,
    data: data?.map(ingredientConverter),
  }
}

export async function fetchTags(): Promise<AppActionResult<Tag[]>> {
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
    .from("tags")
    .select()
    .eq("user_id", userId)

  if (error) {
    return {
      success: false,
      message: "レシピタグの取得に失敗しました。",
    }
  }

  return {
    success: true,
    data: data?.map(tagConverter),
  }
}
