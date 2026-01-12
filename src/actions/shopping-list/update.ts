"use server"

import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth/auth"
import { ShoppingListItemSchema } from "@/lib/shopping-list/shopping-list-item-schema"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
import type { ShoppingListItemInput } from "@/types/shopping-list/shopping-list-item-input"

export async function updateItem(formData: FormData): Promise<AppActionResult> {
  const itemData = JSON.parse(
    formData.get("shoppingListItemData") as string,
  ) as ShoppingListItemInput[]

  const data = []
  for (const i of itemData) {
    const validatedFields = ShoppingListItemSchema.safeParse(i)

    if (!validatedFields.success) {
      return {
        success: false,
        message: "入力内容に誤りがあります。",
      }
    }
    data.push(validatedFields.data)
  }

  const getUserIdResult = await getUserId()
  if (!getUserIdResult.success || !getUserIdResult.data) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }
  const userId = getUserIdResult.data

  const supabase = createClient(cookies())
  for (const item of data) {
    const { error } = await supabase
      .from("shopping_list")
      .update({ status: !item.status })
      .eq("id", item.id)
      .eq("user_id", userId)
    if (error) {
      console.error("Database Error:", error)
      return {
        success: false,
        message: "アイテムの更新に失敗しました。",
      }
    }
  }

  return {
    success: true,
  }
}
