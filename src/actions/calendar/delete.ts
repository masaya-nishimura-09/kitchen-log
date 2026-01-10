"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth/auth"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
import type { CalendarEvent } from "@/types/calendar/calendar-event"

export async function deleteEvent(
  event: CalendarEvent,
): Promise<AppActionResult> {
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
    .from("calendar")
    .delete()
    .eq("id", event.id)
    .eq("user_id", userId)

  if (error) {
    return {
      success: false,
      message: "カレンダーイベントの削除に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/calendar/${event.date}`)
}
