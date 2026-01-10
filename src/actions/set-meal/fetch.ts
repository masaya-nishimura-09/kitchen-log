"use server"

import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth/auth"
import { setMealConverter } from "@/lib/set-meal/set-meal-converter"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
import type { SetMeal } from "@/types/set-meal/set-meal"
import type { SetMealInput } from "@/types/set-meal/set-meal-input"
import type { SetMealSearchParams } from "@/types/set-meal/set-meal-search-params"

export async function fetchSetMeal(
  setMealId: number,
): Promise<AppActionResult<SetMeal>> {
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
    .from("set_meals")
    .select(
      `
      id, 
      user_id, 
      title, 
      memo,
      updated_at,
      created_at,
      set_meal_recipes (
        id, 
        recipe_id, 
        set_meal_id, 
        recipes ( 
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
          )
        )
      )
    `,
    )
    .eq("user_id", userId)
    .eq("id", setMealId)
    .single()

  if (error) {
    return {
      success: false,
      message: "献立の取得に失敗しました。",
    }
  }

  return {
    success: true,
    data: setMealConverter(data),
  }
}

export async function fetchSetMeals(
  searchParams: SetMealSearchParams | undefined,
): Promise<AppActionResult<SetMeal[]>> {
  const getUserIdResult = await getUserId()
  if (!getUserIdResult.success || !getUserIdResult.data) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }
  const userId = getUserIdResult.data

  const titleParam = searchParams?.title || ""

  const supabase = createClient(cookies())
  const { data, error } = await supabase
    .from("set_meals")
    .select(`
      id, 
      user_id, 
      title, 
      memo,
      updated_at,
      created_at,
      set_meal_recipes (
        id, 
        recipe_id, 
        set_meal_id, 
        updated_at,
        created_at,
        recipes ( 
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
          )
        )
      )
    `)
    .eq("user_id", userId)
    .like("title", `%${titleParam}%`)
    .order("updated_at", { ascending: false })

  if (error) {
    return {
      success: false,
      message: "献立の取得に失敗しました。",
    }
  }

  return {
    success: true,
    data: data?.map(setMealConverter),
  }
}

export async function fetchSetMealInput(
  setMealId: number,
): Promise<AppActionResult<SetMealInput>> {
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
    .from("set_meals")
    .select(
      `
      id, 
      user_id, 
      title, 
      memo,
      updated_at,
        created_at,
      set_meal_recipes (
        id, 
        recipe_id, 
        set_meal_id, 
        recipes ( 
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
            )
          )
      )
      `,
    )
    .eq("user_id", userId)
    .eq("id", setMealId)
    .single()

  if (error) {
    return {
      success: false,
      message: "献立の取得に失敗しました。",
    }
  }

  const convertedData = setMealConverter(data)
  const setMealInput = {
    id: convertedData.id,
    title: convertedData.title,
    memo: convertedData.memo || "",
    recipes: convertedData.recipes,
  } as SetMealInput

  return {
    success: true,
    data: setMealInput,
  }
}

export async function fetchLatestSetMeals(
  limit: number,
): Promise<AppActionResult<SetMeal[]>> {
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
    .from("set_meals")
    .select(
      `
      id, 
      user_id, 
      title, 
      memo,
      updated_at,
      created_at,
      set_meal_recipes (
        id, 
        recipe_id, 
        set_meal_id, 
        updated_at,
        created_at,
        recipes ( 
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
            )
          )
      )
      `,
    )
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(limit)

  if (error) {
    return {
      success: false,
      message: "献立の取得に失敗しました。",
    }
  }

  return {
    success: true,
    data: data?.map(setMealConverter),
  }
}
