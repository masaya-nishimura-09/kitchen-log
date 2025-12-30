import type { ShoppingListItem } from "@/types/shopping-list/shopping-list-item"
import type { ShoppingListItemRaw } from "@/types/shopping-list/shopping-list-item-raw"

export function shoppingListItemConverter(data: ShoppingListItemRaw): ShoppingListItem {
  return {
    id: data.id as number,
    userId: data.user_id as string,
    name: data.name as string,
    amount: data.amount as string | null,
    unit: data.unit as string,
    updatedAt: data.updated_at as string,
    createdAt: data.created_at as string,
  }
}
