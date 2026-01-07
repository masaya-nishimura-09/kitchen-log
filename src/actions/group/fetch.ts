"use server"

import {cookies} from "next/headers"
import {getUserId} from "@/actions/auth/auth"
import {createClient} from "@/lib/supabase/server"

export async function fetchGroups(): Promise<Groups[]> {
  const userId = await getUserId()
  if (!userId) {
    throw new Error(
      "認証情報が取得できませんでした。再度ログインしてください。",
    )
  }

  const supabase = createClient(cookies())
  const {data, error} = await supabase
    .from("groups")
    .select(
      `
      id,
      name,
      created_at,
      group_members (
        id,
        user_id,
        role,
      )`
    )
    .order("created_at", {ascending: false})

  if (error) {
    console.error("Groups Fetch Failed:", error)
    throw new Error("グループの取得に失敗しました。")
  }

  return data.map(groupsDataConverter)
}
