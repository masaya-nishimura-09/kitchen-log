"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function deleteUser() {
  const supabase = createClient(cookies())

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser()
  if (getUserError || !user?.id) {
    console.error(getUserError)
    throw new Error("ユーザー情報の取得に失敗しました。")
  }

  const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
    user.id,
  )
  if (deleteUserError) {
    console.error(deleteUserError)
    throw new Error("アカウントの削除に失敗しました。")
  }
}
