"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { EventFormSchema } from "@/lib/schemas/event-form"
import { createClient } from "@/lib/supabase/server"
import type { EventInput } from "@/types/calendar/event-input"
import { getUserId } from "../auth/auth"

export async function createEvent(formData: FormData) {
  const eventData = JSON.parse(
    formData.get("eventData") as string,
  ) as EventInput

  const validatedFields = EventFormSchema.safeParse({
    recipeId: eventData.recipeId,
    date: eventData.date,
  })

  if (!validatedFields.success) {
    console.error(validatedFields.error)
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }
  const { recipeId, date } = validatedFields.data

  const userId = await getUserId()
  if (!userId) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }

  const supabase = createClient(cookies())

  const { error } = await supabase.from("calendar").insert({
    user_id: userId,
    recipe_id: recipeId,
    date: date,
  })

  if (error) {
    console.error("Calendar insert failed:", error)
    return {
      success: false,
      message: "データベースへの保存に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/calendar/${date}`)
}

export async function createEvents(formData: FormData) {
  const eventData = JSON.parse(
    formData.get("eventData") as string,
  ) as EventInput[]

  const userId = await getUserId()
  if (!userId) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }

  const insertData = []

  for (const e of eventData) {
    const validatedFields = EventFormSchema.safeParse({
      recipeId: e.recipeId,
      date: e.date,
    })

    if (!validatedFields.success) {
      console.error(validatedFields.error)
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "入力内容に誤りがあります。",
      }
    }

    insertData.push({
      user_id: userId,
      recipe_id: validatedFields.data.recipeId,
      date: validatedFields.data.date,
    })
  }

  const supabase = createClient(cookies())

  const { error } = await supabase.from("calendar").insert(insertData)

  if (error) {
    console.error("Calendar insert failed:", error)
    return {
      success: false,
      message: "データベースへの保存に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/calendar/${insertData[0].date}`)
}
