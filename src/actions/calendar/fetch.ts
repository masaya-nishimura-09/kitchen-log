"use server"

import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth/auth"
import { calendarEventConverter } from "@/lib/calendar/shopping-list-item-converter"
import { createClient } from "@/lib/supabase/server"
import type { CalendarEvent } from "@/types/calendar/calendar-event"

export async function fetchEvents(): Promise<CalendarEvent[]> {
  const userId = await getUserId()
  if (!userId) {
    throw new Error(
      "認証情報が取得できませんでした。再度ログインしてください。",
    )
  }

  const supabase = createClient(cookies())
  const { data, error } = await supabase
    .from("calendar")
    .select(
      `
      id,
      user_id,
      recipe_id,
      date,
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
      `,
    )
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Calendar events Fetch Failed:", error)
    throw new Error("カレンダー情報の取得に失敗しました。")
  }

  return data.map(calendarEventConverter)
}
