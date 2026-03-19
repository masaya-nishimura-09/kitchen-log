"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { EventSchema } from "@/lib/calendar/event-schema"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
import type { EventInput } from "@/types/calendar/event-input"
import { getUserId } from "../auth/auth"

export async function createEvent(
  formData: FormData,
): Promise<AppActionResult> {
  const eventData = JSON.parse(
    formData.get("eventData") as string,
  ) as EventInput

  const validatedFields = EventSchema.safeParse({
    recipeId: eventData.recipeId,
    start: eventData.start,
    color: eventData.color,
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }
  const { recipeId, start, color } = validatedFields.data

  const getUserIdResult = await getUserId()
  if (!getUserIdResult.success || !getUserIdResult.data) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }
  const userId = getUserIdResult.data

  const supabase = createClient(cookies())

  const { error } = await supabase.from("calendar").insert({
    user_id: userId,
    recipe_id: recipeId,
    start: start,
    background_color: color,
    border_color: color,
  })

  if (error) {
    return {
      success: false,
      message: "データベースへの保存に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/calendar`)
}

export async function createEvents(
  formData: FormData,
): Promise<AppActionResult> {
  const eventData = JSON.parse(
    formData.get("eventData") as string,
  ) as EventInput[]

  const getUserIdResult = await getUserId()
  if (!getUserIdResult.success || !getUserIdResult.data) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }
  const userId = getUserIdResult.data

  const insertData = []

  for (const e of eventData) {
    const validatedFields = EventSchema.safeParse({
      recipeId: e.recipeId,
      start: e.start,
      color: e.color,
    })

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "入力内容に誤りがあります。",
      }
    }

    insertData.push({
      user_id: userId,
      recipe_id: validatedFields.data.recipeId,
      start: validatedFields.data.start,
      background_color: validatedFields.data.color,
      border_color: validatedFields.data.color,
    })
  }

  const supabase = createClient(cookies())

  const { error } = await supabase.from("calendar").insert(insertData)

  if (error) {
    return {
      success: false,
      message: "データベースへの保存に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/calendar`)
}
