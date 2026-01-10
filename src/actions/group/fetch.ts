"use server"

import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth/auth"
import { groupDataConverter } from "@/lib/group/group-data-converter"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
import type { Group } from "@/types/group/group"

export async function fetchGroups(): Promise<AppActionResult<Group[]>> {
  const userId = await getUserId()
  if (!userId) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
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
    return {
      success: false,
      message: "グループの取得に失敗しました。",
    }
  }

  return {
    success: true,
    data: data.map(groupDataConverter),
  }
}
