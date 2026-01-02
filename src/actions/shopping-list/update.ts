"use server"

import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth/auth"
import { ShoppingListItemUpdateFormSchema } from "@/lib/schemas/shopping-list-item-update-form"
import { createClient } from "@/lib/supabase/server"
import type { ShoppingListItemInput } from "@/types/shopping-list/shopping-list-item-input"

export async function updateItem(formData: FormData) {
  const itemData = JSON.parse(
    formData.get("shoppingListItemData") as string,
  ) as ShoppingListItemInput

  const validatedFields = ShoppingListItemUpdateFormSchema.safeParse(itemData)

  if (!validatedFields.success) {
    console.error(validatedFields.error)
    throw new Error("Internal Server Error")
  }
  const data = validatedFields.data

  const userId = await getUserId()
  if (!userId) {
    throw new Error(
      "認証情報が取得できませんでした。再度ログインしてください。",
    )
  }

  const supabase = createClient(cookies())
  for (const item of data) {
    const { error } = await supabase
      .from("shopping_list")
      .update({ status: !item.status })
      .eq("id", item.id)
      .eq("user_id", userId)
    if (error) {
      console.error("Database Error:", error)
      throw new Error("アイテムの更新に失敗しました。d")
    }
  }
}
