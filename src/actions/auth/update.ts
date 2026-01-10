"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { EmailFormSchema } from "@/lib/schemas/email-form"
import { PasswordFormSchema } from "@/lib/schemas/password-form"
import { UsernameFormSchema } from "@/lib/schemas/username-form"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
import { getUserId } from "./auth"

export async function updateUsername(
  _prevState: AppActionResult | undefined,
  formData: FormData,
): Promise<AppActionResult> {
  const validatedFields = UsernameFormSchema.safeParse({
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
    console.error("Username update failed:", error)
    return {
      success: false,
      message: "ユーザーネームの変更に失敗しました。",
    }
  }

  const updateProfileResult = await updateProfile(username)
  if (!updateProfileResult.success) {
    return {
      success: false,
      message: "ユーザーネームの変更に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard/setting")
}

export async function updateEmail(
  _prevState: AppActionResult | undefined,
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
  _prevState: AppActionResult | undefined,
  formData: FormData,
): Promise<AppActionResult> {
  const validatedFields = PasswordFormSchema.safeParse({
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

export async function updateProfile(
  username: string,
): Promise<AppActionResult> {
  const userId = await getUserId()
  if (!userId.success) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。",
    }
  }

  const supabase = createClient(cookies())

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: username })
    .eq("id", userId)

  if (error) {
    console.error("Profile display name update failed:", error)
    return {
      success: false,
      message: "プロファイルの更新に失敗しました。",
    }
  }

  return {
    success: true,
  }
}
