"use server"

import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth"
import { ShoppingListItemFormSchema } from "@/lib/schemas/shopping-list-item-form"
import { createClient } from "@/lib/supabase/server"
import type { ShoppingListItemInput } from "@/types/shopping-list/shopping-list-item-input"

export async function updateItem(formData: FormData) {
  const itemData = JSON.parse(
    formData.get("shoppingListItemData") as string,
  ) as ShoppingListItemInput

  const validatedFields = ShoppingListItemFormSchema.safeParse({
    id: itemData.id,
    name: itemData.name,
    amount: itemData.amount,
    unit: itemData.unit,
    status: itemData.status,
  })

  if (!validatedFields.success) {
    console.error(validatedFields.error)
    throw new Error("入力内容に誤りがあります。")
  }
  const { id, status } = validatedFields.data

  const userId = await getUserId()
  if (!userId) {
    throw new Error(
      "認証情報が取得できませんでした。再度ログインしてください。",
    )
  }
  const supabase = createClient(cookies())
  const { error } = await supabase
    .from("shopping_list")
    .update({
      status: !status,
    })
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    console.error("Database Error:", error)
    throw new Error("アイテムの更新に失敗しました。d")
  }
}
