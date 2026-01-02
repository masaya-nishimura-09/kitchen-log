"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { UsernameFormSchema } from "@/lib/schemas/username-form"
import { createClient } from "@/lib/supabase/server"
import type { UsernameState } from "@/types/auth"

export async function updateUsername(
  _prevState: UsernameState | undefined,
  formData: FormData,
) {
  const validatedFields = UsernameFormSchema.safeParse({
    username: formData.get("username"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "ユーザーネームの変更に失敗しました。",
    }
  }
  const { username } = validatedFields.data

  const supabase = createClient(cookies())

  const { error } = await supabase.auth.updateUser({
    data: { name: username },
  })

  if (error) {
    console.error("Username update failed:", error)
    return {
      success: false,
      message: "ユーザーネームの変更に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard/setting")
}
