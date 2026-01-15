"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { EmailFormSchema } from "@/lib/auth/email-schema"
import { PasswordSchema } from "@/lib/auth/password-schema"
import { UsernameSchema } from "@/lib/auth/username-schema"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"

export async function updateUsername(
  formData: FormData,
): Promise<AppActionResult> {
  const validatedFields = UsernameSchema.safeParse({
    username: formData.get("username"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }
  const { username } = validatedFields.data

  const supabase = createClient(cookies())

  const { error } = await supabase.auth.updateUser({
    data: { name: username },
  })

  if (error) {
    return {
      success: false,
      message: "ユーザーネームの変更に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard/setting")
}

export async function updateEmail(
  formData: FormData,
): Promise<AppActionResult> {
  const validatedFields = EmailFormSchema.safeParse({
    email: formData.get("email"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }
  const { email } = validatedFields.data

  const supabase = createClient(cookies())

  const { error } = await supabase.auth.updateUser({
    email: email,
  })

  if (error) {
    return {
      success: false,
      message: "メールアドレスの変更に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard/setting")
}

export async function updatePassword(
  formData: FormData,
): Promise<AppActionResult> {
  const validatedFields = PasswordSchema.safeParse({
    password: formData.get("password"),
    confirmedPassword: formData.get("confirmed-password"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }
  const { password } = validatedFields.data

  const supabase = createClient(cookies())

  const { error } = await supabase.auth.updateUser({
    password: password,
  })
  if (error) {
    return {
      success: false,
      message: "パスワードの変更に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard/setting")
}

export async function sendResetPasswordEmail(
  formData: FormData,
): Promise<AppActionResult> {
  const validatedFields = EmailFormSchema.safeParse({
    email: formData.get("email"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }
  const { email } = validatedFields.data

  const supabase = createClient(cookies())

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
  })

  if (error) {
    return {
      success: false,
      message: "パスワードのアップデート用メールの送信に失敗しました。",
    }
  }

  return {
    success: true,
  }
}
