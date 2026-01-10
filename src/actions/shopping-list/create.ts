"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserId } from "@/actions/auth/auth"
import { fetchShoppingList } from "@/actions/shopping-list/fetch"
import { zenkakuToHankaku } from "@/lib/recipe/zenkaku-to-hankaku"
import { ShoppingListItemFormSchema } from "@/lib/schemas/shopping-list-item-form"
import { createClient } from "@/lib/supabase/server"
import type { AppActionResult } from "@/types/app-action-result"
import type { Recipe } from "@/types/recipe/recipe"
import type { ShoppingListItemInput } from "@/types/shopping-list/shopping-list-item-input"

async function insertItem(
  userId: string,
  name: string | null,
  amount: string | null,
  unit: string,
): Promise<AppActionResult> {
  if (!name) {
    return {
      success: false,
      message: "アイテム名がありません。",
    }
  }

  const supabase = createClient(cookies())
  const { error } = await supabase.from("shopping_list").insert({
    user_id: userId,
    name: name,
    amount: amount,
    unit: unit,
  })

  if (error) {
    console.error(error)
    return {
      success: false,
      message: "アイテムの登録に失敗しました。",
    }
  }

  return {
    success: true,
  }
}

export async function createItem(
  formData: FormData,
): Promise<AppActionResult> {
  const itemData = JSON.parse(
    formData.get("shoppingListItemData") as string,
  ) as ShoppingListItemInput[]

  for (const i of itemData) {
    const validatedFields = ShoppingListItemFormSchema.safeParse({
      id: i.id,
      name: i.name,
      amount: i.amount,
      unit: i.unit,
      status: i.status,
    })

    if (!validatedFields.success) {
      console.error(validatedFields.error)
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "入力内容に誤りがあります。",
      }
    }
  }

  const convertedData = itemData.map((i) => ({
    name: zenkakuToHankaku(i.name),
    amount: zenkakuToHankaku(i.amount),
    unit: i.unit,
  }))

  const getUserIdResult = await getUserId()
  if (!getUserIdResult.success || !getUserIdResult.data) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }
  const userId = getUserIdResult.data

  const fetchResult = await fetchShoppingList()
  if (!fetchResult.success || !fetchResult.data) {
    return {
      success: false,
      message: "アイテムの登録に失敗しました。",
    }
  }
  const shoppingList = fetchResult.data.filter((r) => r.status === false)

  for (const data of convertedData) {
    const sameItem = shoppingList.find(
      (item) => item.name === data.name && item.unit === data.unit,
    )

    if (shoppingList.length < 1 || !sameItem) {
      const insertResult = await insertItem(userId, data.name, data.amount, data.unit)
      if (!insertResult.success) {
        return insertResult
      }
      continue
    }

    const newAmount = Number(data.amount) + Number(sameItem.amount)
    if (!Number.isNaN(newAmount)) {
      const supabase = createClient(cookies())
      const { error } = await supabase
        .from("shopping_list")
        .update({
          amount: newAmount,
        })
        .eq("id", sameItem.id)
        .eq("user_id", userId)

      if (error) {
        console.error(error)
        return {
          success: false,
          message: "アイテムの登録に失敗しました。",
        }
      }
    } else {
      console.error("Failed")
      return {
        success: false,
        message: "アイテムの登録に失敗しました。",
      }
    }
  }
  revalidatePath("/", "layout")
  redirect(`/dashboard/shopping-list`)
}

export async function createFromRecipe(
  recipes: Recipe[],
): Promise<AppActionResult> {
  const ingredients = []
  for (const recipe of recipes) {
    ingredients.push(...recipe.ingredient)
  }

  for (const ingredient of ingredients) {
    const fd = new FormData()

    fd.append(
      "shoppingListItemData",
      JSON.stringify([
        {
          id: ingredient.id,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          status: false,
        },
      ]),
    )

    const result = await createItem(fd)
    if (!result.success) {
      return {
        success: false,
        message: "アイテムの登録に失敗しました。",
      }
    }
  }

  return {
    success: true,
  }
}
