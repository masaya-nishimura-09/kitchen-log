"use server"

import {revalidatePath} from "next/cache"
import {cookies} from "next/headers"
import {redirect} from "next/navigation"
import {getUserId} from "@/actions/auth/auth"
import {GroupFormSchema} from "@/lib/schemas/group-form"
import {createClient} from "@/lib/supabase/server"
import type {GroupFormInput, GroupFormState} from "@/types/group/group-form"

export async function createGroup(formData: FormData): Promise<GroupFormState> {
  const groupData = JSON.parse(
    formData.get("groupData") as string,
  ) as GroupFormInput

  const validatedFields = GroupFormSchema.safeParse({
    name: groupData.name,
  })

  if (!validatedFields.success) {
    console.error(validatedFields.error)
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }

  const {name} = validatedFields.data

  const userId = await getUserId()
  if (!userId) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }

  const supabase = createClient(cookies())
  const {data, error: groupInsertError} = await supabase
    .from("groups")
    .insert({
      name: name,
      admin_id: userId,
    })
    .select()
    .single()

  if (groupInsertError) {
    console.error("Group Insert Failed", groupInsertError)
    return {
      success: false,
      message: "グループの作成に失敗しました。",
    }
  }

  if (!data || !data.id) {
    console.error("Group Insert Failed")
    return {
      success: false,
      message: "グループの作成に失敗しました。",
    }
  }

  const {error: groupMembersInsertError} = await supabase
    .from("group_members")
    .insert({
      user_id: userId,
      group_id: data.id,
      role: "admin",
    })

  if (groupMembersInsertError) {
    console.error("Group Members Insert Failed", groupMembersInsertError)
    return {
      success: false,
      message: "グループの作成に失敗しました。",
    }
  }

  revalidatePath("/", "layout")
  redirect(`/dashboard/group`)
}
