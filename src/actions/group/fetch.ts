"use server"

import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth/auth"
import { groupDataConverter } from "@/lib/group/group-data-converter"
import { createClient } from "@/lib/supabase/server"
import type { Group } from "@/types/group/group"

export async function fetchGroups(): Promise<Group[]> {
  const userId = await getUserId()
  if (!userId) {
    throw new Error(
      "認証情報が取得できませんでした。再度ログインしてください。",
    )
  }

  const supabase = createClient(cookies())
  const { data, error } = await supabase
    .from("groups")
    .select(
      `
      id,
      admin_id,
      name,
      created_at,
      group_members (
        id,
        user_id,
        role,
        profiles (
          display_name
        )
      )`,
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Groups Fetch Failed:", error)
    throw new Error("グループの取得に失敗しました。")
  }

  return data.map(groupDataConverter)
}
