"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth/auth"
import { createClient } from "@/lib/supabase/server"

export async function deleteEvent(id: number) {
  const userId = await getUserId()
  if (!userId) {
    throw new Error(
      "認証情報が取得できませんでした。再度ログインしてください。",
    )
  }

  const supabase = createClient(cookies())
  const { error } = await supabase.from("calendar").delete().eq("id", id)

  if (error) {
    console.error("Event delete failed:", error)
    throw new Error("カレンダーイベントの削除に失敗しました。")
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/calendar`)
}
