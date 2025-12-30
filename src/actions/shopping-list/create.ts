"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth"
import { ShoppingListItemFormSchema } from "@/lib/schemas/shopping-list-item-form"
import { createClient } from "@/lib/supabase/server"
import type {
  ShoppingListItemInput,
  ShoppingListItemState,
} from "@/types/shopping-list/shopping-list-item-input"

async function insertItem(
  userId: string,
  name: string,
  amount: string,
  unit: string,
) {
  const supabase = createClient(cookies())
  const { error } = await supabase.from("shopping_list").insert({
    user_id: userId,
    name: name,
    amount: amount,
    unit: unit,
  })

  if (error) {
    console.error("Item insert failed:", error)
    throw new Error(error.message)
  }
}

export async function createItem(
  formData: FormData,
): Promise<ShoppingListItemState> {
  const itemData = JSON.parse(
    formData.get("shoppingListItemData") as string,
  ) as ShoppingListItemInput

  const validatedFields = ShoppingListItemFormSchema.safeParse({
    id: itemData.id,
    name: itemData.name,
    amount: itemData.amount,
    unit: itemData.unit,
  })

  if (!validatedFields.success) {
    console.error(validatedFields.error)
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }
  const { name, amount, unit } = validatedFields.data

  // don't add item if the unit is "少々" or "適量"
  if (unit === "少々" || unit === "適量") {
    revalidatePath("/", "layout")
    redirect(`/dashboard/shopping-list`)
  }

  const hankakuName = zenkakuToHankaku(name)
  const hankakuAmount = zenkakuToHankaku(amount)

  const userId = await getUserId()
  if (!userId) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }

  const list = await fetchShoppingList(false)

  if (!list || list.length === 0) {
    try {
      await insertItem(userId, hankakuName, hankakuAmount, unit)
      revalidatePath("/", "layout")
      redirect(`/dashboard/shopping-list`)
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "データベースへの保存に失敗しました。",
      }
    }
  } else {
    const sameItem = list.find(
      (item) => item.name === hankakuName && item.unit === unit,
    )

      if (!sameItem) {
        try {
          await insertItem(userId, hankakuName, hankakuAmount, unit)
          revalidatePath("/", "layout")
          redirect(`/dashboard/shopping-list`)
        } catch (error) {
          console.error(error)
          return {
            success: false,
            message: "データベースへの保存に失敗しました。",
          }
        }
      }

      const newAmount = Number(amount) + Number(sameItem.amount)

    if (!Number.isNaN(newAmount)) {
//      await updateItem(sameItem.id, String(newAmount))
    }
  }
}
