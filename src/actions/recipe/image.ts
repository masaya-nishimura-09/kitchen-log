"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"

export async function uploadImage(
  file: File,
  userId: string,
): Promise<AppActionResult<string>> {
  const supabase = createClient(cookies())

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("recipe-images")
    .upload(`${userId}/${Date.now()}-${file.name}`, file)

  if (uploadError) {
    return {
      success: false,
      message: "画像のアップロードに失敗しました。",
    }
  }

  return {
    success: true,
    data: uploadData.path,
  }
}

export async function deleteImage(imageUrl: string): Promise<AppActionResult> {
  const supabase = createClient(cookies())

  const { error: removeError } = await supabase.storage
    .from("recipe-images")
    .remove([imageUrl])

  if (removeError) {
    return {
      success: false,
      message: "画像の削除に失敗しました。",
    }
  }

  return {
    success: true,
  }
}
