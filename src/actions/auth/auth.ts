"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SignInFormSchema } from "@/lib/schemas/sign-in-form"
import { SignUpFormSchema } from "@/lib/schemas/sign-up-form"
import { createClient } from "@/lib/supabase/server"
import type { SignInState, SignUpState } from "@/types/auth"

export async function getUserId() {
  const supabase = createClient(cookies())
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  if (user) {
    return user.id
  } else {
    return null
  }
}

export async function signUp(
  _prevState: SignUpState | undefined,
  formData: FormData,
) {
  const validatedFields = SignUpFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmedPassword: formData.get("confirmed-password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "会員登録に失敗しました。",
    }
  }
  const { name, email, password } = validatedFields.data

  const supabase = createClient(cookies())
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { name },
    },
  })
  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("SignUp error:", error)
    }
    switch (error.code) {
      case "email_exists":
        return { message: "このメールアドレスは既に使用されています。" }
      case "validation_failed":
        return {
          message: "メールアドレスまたはパスワードの形式が正しくありません。",
        }
      case "signup_disabled":
        return { message: "現在、新規登録を受け付けていません。" }
      case "user_banned":
        return { message: "このアカウントは利用できません。" }
      default:
        return {
          message: "会員登録に失敗しました。しばらくしてからお試しください。",
        }
    }
  }
  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signIn(
  _prevState: SignInState | undefined,
  formData: FormData,
) {
  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "ログインに失敗しました。",
    }
  }
  const { email, password } = validatedFields.data

  const supabase = createClient(cookies())
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("SignIn error:", error)
    }
    switch (error.code) {
      case "user_banned":
        return {
          message:
            "このアカウントは利用できません。サポートにお問い合わせください。",
        }
      case "email_not_confirmed":
        return {
          message:
            "メールアドレスの確認が完了していません。確認メールをご確認ください。",
        }
      default:
        return { message: "メールアドレスまたはパスワードが正しくありません。" }
    }
  }
  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signOut() {
  const supabase = createClient(cookies())
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/sign-in")
}
