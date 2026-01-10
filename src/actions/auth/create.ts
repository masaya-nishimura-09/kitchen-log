import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"

export async function createProfile(
  id: string,
  username: string,
): Promise<AppActionResult> {
  const supabase = createClient(cookies())

  const { error } = await supabase.from("profiles").insert({
    id: id,
    display_name: username,
  })

  if (error) {
    console.error("Profiles insert failed:", error)
    return {
      success: false,
      message: "プロファイルの作成に失敗しました。",
    }
  }

  return {
    success: true,
  }
}
