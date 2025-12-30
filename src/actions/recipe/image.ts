"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function uploadImage(file: File, userId: string): Promise<string> {
  const supabase = createClient(cookies())

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("recipe-images")
    .upload(`${userId}/${Date.now()}-${file.name}`, file)

  if (uploadError) {
    console.error("Supabase upload error:", uploadError)
    throw new Error(uploadError.message)
  }

  return uploadData.path
}

export async function deleteImage(imageUrl: string) {
  const supabase = createClient(cookies())

  const { error: removeError } = await supabase.storage
    .from("recipe-images")
    .remove([imageUrl])

  if (removeError) {
    console.error("Supabase file delete error:", removeError)
    throw new Error(removeError.message)
  }
}
