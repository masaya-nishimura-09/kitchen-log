"use server"

import type { EventInput } from "@fullcalendar/core"
import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth/auth"
import { calendarEventConverter } from "@/lib/calendar/shopping-list-item-converter"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"

export async function fetchEvents(): Promise<AppActionResult<EventInput[]>> {
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
    .from("calendar")
    .select(
      `
      id,
      user_id,
      recipe_id,
      start,
      background_color,
      border_color,
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
    return {
      success: false,
      message: "カレンダー情報の取得に失敗しました。",
    }
  }

  return {
    success: true,
    data: data.map(calendarEventConverter),
  }
}
