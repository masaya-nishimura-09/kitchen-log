"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import z from "zod"
import { getUserId } from "@/actions/auth/auth"
import { DeleteShoppingListItemSchema } from "@/lib/shopping-list/shopping-list-item-schema"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
import type { ShoppingListItemInput } from "@/types/shopping-list/shopping-list-item-input"

export async function deleteItem(id: number): Promise<AppActionResult> {
  const getUserIdResult = await getUserId()
  if (!getUserIdResult.success || !getUserIdResult.data) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }
  const userId = getUserIdResult.data

  const supabase = createClient(cookies())
  const { error } = await supabase
    .from("shopping_list")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    return {
      success: false,
      message: "アイテムの削除に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/shopping-list`)
}

export async function deleteItems(
  formData: FormData,
): Promise<AppActionResult> {
  const itemData = JSON.parse(
    formData.get("shoppingListItemData") as string,
  ) as ShoppingListItemInput[]

  const validatedFields = z
    .array(DeleteShoppingListItemSchema)
    .safeParse(itemData)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "入力内容に誤りがあります。",
    }
  }

  const getUserIdResult = await getUserId()
  if (!getUserIdResult.success || !getUserIdResult.data) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }
  const userId = getUserIdResult.data

  const ids = validatedFields.data.map((item) => item.id)

  const supabase = createClient(cookies())
  const { error } = await supabase
    .from("shopping_list")
    .delete()
    .in("id", ids)
    .eq("user_id", userId)

  if (error) {
    console.error("Database Error:", error)
    return {
      success: false,
      message: "アイテムの削除に失敗しました。",
    }
  }

  return {
    success: true,
  }
}
