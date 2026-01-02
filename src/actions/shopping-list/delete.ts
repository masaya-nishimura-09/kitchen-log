"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth/auth"
import { createClient } from "@/lib/supabase/server"

export async function deleteItem(id: number) {
  const userId = await getUserId()
  if (!userId) {
    throw new Error(
      "認証情報が取得できませんでした。再度ログインしてください。",
    )
  }

  const supabase = createClient(cookies())
  const { error } = await supabase
    .from("shopping_list")
    .delete()
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Item delete failed:", error)
    throw new Error("アイテムの削除に失敗しました。")
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/shopping-list`)
}
