"use server"

import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth"
import { shoppingListItemConverter } from "@/lib/shopping-list/shopping-list-item-converter"
import { createClient } from "@/lib/supabase/server"
import type { ShoppingListItem } from "@/types/shopping-list/shopping-list-item"

export async function fetchShoppingList(): Promise<ShoppingListItem[]> {
  const userId = await getUserId()
  if (!userId) {
    throw new Error(
      "認証情報が取得できませんでした。再度ログインしてください。",
    )
  }

  const supabase = createClient(cookies())
  const { data, error } = await supabase
    .from("shopping_list")
    .select()
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Shopping List Fetch Failed:", error)
    throw new Error("買い物リストの取得に失敗しました。")
  }

  return data?.map(shoppingListItemConverter)
}
