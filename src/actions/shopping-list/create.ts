"use server"

import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth"
import { fetchShoppingList } from "@/actions/shopping-list/fetch"
import { zenkakuToHankaku } from "@/lib/recipe/zenkaku-to-hankaku"
import { ShoppingListItemFormSchema } from "@/lib/schemas/shopping-list-item-form"
import { createClient } from "@/lib/supabase/server"
import type { Recipe } from "@/types/recipe/recipe"
import type {
  ShoppingListItemInput,
  ShoppingListItemState,
} from "@/types/shopping-list/shopping-list-item-input"

async function insertItem(
  userId: string,
  name: string | null,
  amount: string | null,
  unit: string,
) {
  if (!name) {
    throw new Error("アイテム名がありません。")
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
    throw new Error("アイテムの登録に失敗しました。")
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
    status: itemData.status,
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

  const convertedName = zenkakuToHankaku(name)
  const convertedAmount = zenkakuToHankaku(amount)

  const userId = await getUserId()
  if (!userId) {
    return {
      success: false,
      message: "認証情報が取得できませんでした。再度ログインしてください。",
    }
  }

  try {
    const list = await fetchShoppingList()
    const sameItem = list.find(
      (item) => item.name === convertedName && item.unit === unit,
    )

    if (list.length < 1 || !sameItem) {
      await insertItem(userId, convertedName, convertedAmount, unit)
      return {
        success: true,
      }
    }

    const newAmount = Number(convertedAmount) + Number(sameItem.amount)
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
      return {
        success: true,
      }
    } else {
      console.error("Failed")
      return {
        success: false,
        message: "アイテムの登録に失敗しました。",
      }
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: "アイテムの登録に失敗しました。",
    }
  }
}

export async function createFromRecipe(recipes: Recipe[]) {
  const ingredients = []
  for (const recipe of recipes) {
    ingredients.push(...recipe.ingredient)
  }

  for (const ingredient of ingredients) {
    const fd = new FormData()

    fd.append(
      "shoppingListItemData",
      JSON.stringify({
        id: ingredient.id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        status: false,
      }),
    )

    const result = await createItem(fd)
    if (!result.success) {
      throw new Error("アイテムの登録に失敗しました。")
    }
  }
}
