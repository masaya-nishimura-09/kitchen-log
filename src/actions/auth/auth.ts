// todo: userとprofileの作成をsupabaseで一つの関数に

"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SignInSchema } from "@/lib/auth/sign-in-schema"
import { SignUpSchema } from "@/lib/auth/sign-up-schema"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
// import { createProfile } from "./create"

export async function getUserId(): Promise<AppActionResult<string>> {
  const supabase = createClient(cookies())
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    return {
      success: false,
      message: "ユーザーIDの取得に失敗しました。",
    }
  }

  if (user) {
    return {
      success: true,
      data: user.id,
    }
  } else {
    return {
      success: false,
      message: "ユーザーが見つかりませんでした。",
    }
  }
}

export async function signUp(formData: FormData) {
  const validatedFields = SignUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
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
  const { name, email, password } = validatedFields.data

  const supabase = createClient(cookies())
  const { data, error } = await supabase.auth.signUp({
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
        return {
          success: false,
          message: "このメールアドレスは既に使用されています。",
        }
      case "validation_failed":
        return {
          success: false,
          message: "メールアドレスまたはパスワードの形式が正しくありません。",
        }
      case "signup_disabled":
        return {
          success: false,
          message: "現在、新規登録を受け付けていません。",
        }
      case "user_banned":
        return { success: false, message: "このアカウントは利用できません。" }
      default:
        return {
          success: false,
          message: "会員登録に失敗しました。しばらくしてからお試しください。",
        }
    }
  }

  if (!data || !data.user) {
    return {
      success: false,
      message: "会員登録に失敗しました。",
    }
  }

  // const createProfileResult = await createProfile(data.user.id, name)
  // if (!createProfileResult.success) {
  //   return {
  //     success: false,
  //     message: "会員登録に失敗しました。",
  //   }
  // }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signIn(formData: FormData) {
  const validatedFields = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
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
          success: false,
          message:
            "このアカウントは利用できません。サポートにお問い合わせください。",
        }
      case "email_not_confirmed":
        return {
          success: false,
          message:
            "メールアドレスの確認が完了していません。確認メールをご確認ください。",
        }
      default:
        return {
          success: false,
          message: "メールアドレスまたはパスワードが正しくありません。",
        }
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
