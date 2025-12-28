"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function uploadImage(
  file: File,
  userId: string,
): Promise<{ url: string | null; error?: string }> {
  try {
    const supabase = createClient(cookies())

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("recipe-images")
      .upload(`${userId}/${Date.now()}-${file.name}`, file)

    if (uploadError) {
      console.error("Supabase upload error:", uploadError)
      return { url: null, error: uploadError.message }
    }

    return { url: uploadData.path }
  } catch (error) {
    console.error("Image upload failed:", error)
    return {
      url: null,
      error:
        error instanceof Error
          ? error.message
          : "画像アップロードに失敗しました",
    }
  }
}

export async function deleteImage(
  imageUrl: string,
): Promise<{ error?: string } | null> {
  try {
    const supabase = createClient(cookies())

    const { error: removeError } = await supabase.storage
      .from("recipe-images")
      .remove([imageUrl])

    if (removeError) {
      console.error("Supabase file delete error:", removeError)
      return { error: removeError.message }
    }

    return null
  } catch (error) {
    console.error("Image delete failed:", error)
    return {
      error:
        error instanceof Error ? error.message : "画像の削除に失敗しました",
    }
  }
}
