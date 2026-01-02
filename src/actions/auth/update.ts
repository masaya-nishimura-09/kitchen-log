"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { EmailFormSchema } from "@/lib/schemas/email-form"
import { PasswordFormSchema } from "@/lib/schemas/password-form"
import { UsernameFormSchema } from "@/lib/schemas/username-form"
import { createClient } from "@/lib/supabase/server"
import type { EmailState, PasswordState, UsernameState } from "@/types/auth"

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

export async function updateEmail(
  _prevState: EmailState | undefined,
  formData: FormData,
) {
  const validatedFields = EmailFormSchema.safeParse({
    email: formData.get("email"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "メールアドレスの変更に失敗しました。",
    }
  }
  const { email } = validatedFields.data

  const supabase = createClient(cookies())

  const { error } = await supabase.auth.updateUser({
    email: email,
  })

  if (error) {
    console.error("Email update failed:", error)
    return {
      success: false,
      message: "メールアドレスの変更に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard/setting")
}

export async function updatePassword(
  _prevState: PasswordState | undefined,
  formData: FormData,
) {
  const validatedFields = PasswordFormSchema.safeParse({
    password: formData.get("password"),
    confirmedPassword: formData.get("confirmed-password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "パスワードの変更に失敗しました。",
    }
  }
  const { password } = validatedFields.data

  const supabase = createClient(cookies())

  const { error } = await supabase.auth.updateUser({
    password: password,
  })
  if (error) {
    console.error("Password update failed:", error)
    return {
      success: false,
      message: "パスワードの変更に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard/setting")
}
