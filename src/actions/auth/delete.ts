"use server"

import {cookies} from "next/headers"
import type {AppActionResult} from "@/types/app-action-result"
import {createClient} from "@/lib/supabase/admin"
import {revalidatePath} from "next/cache"
import {redirect} from "next/navigation"

export async function deleteUser(): Promise<AppActionResult> {
  const supabase = createClient(cookies())

  const {
    data: {user},
    error: getUserError,
  } = await supabase.auth.getUser()
  if (getUserError || !user?.id) {
    return {
      success: false,
      message: "ユーザー情報の取得に失敗しました。",
    }
  }

  const {error: deleteUserError} = await supabase.auth.admin.deleteUser(
    user.id,
  )
  if (deleteUserError) {
    return {
      success: false,
      message: "アカウントの削除に失敗しました。",
    }
  }

  await supabase.auth.signOut()

  revalidatePath("/", "layout")
  redirect("/dashboard")
}
