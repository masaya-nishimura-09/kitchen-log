"use server"

import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth/auth"
import { shoppingListItemConverter } from "@/lib/shopping-list/shopping-list-item-converter"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
import type { ShoppingListItem } from "@/types/shopping-list/shopping-list-item"

export async function fetchShoppingList(): Promise<
  AppActionResult<ShoppingListItem[]>
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
    .from("shopping_list")
    .select()
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) {
    return {
      success: false,
      message: "買い物リストの取得に失敗しました。",
    }
  }

  return {
    success: true,
    data: data?.map(shoppingListItemConverter),
  }
}

export async function fetchLatestShoppingList(
  limit: number,
): Promise<AppActionResult<ShoppingListItem[]>> {
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
    .from("shopping_list")
    .select()
    .eq("user_id", userId)
    .eq("status", false)
    .order("updated_at", { ascending: false })
    .limit(limit)

  if (error) {
    return {
      success: false,
      message: "買い物リストの取得に失敗しました。",
    }
  }

  return {
    success: true,
    data: data?.map(shoppingListItemConverter),
  }
}
