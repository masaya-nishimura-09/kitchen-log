import { notFound } from "next/navigation"
import { fetchShoppingList } from "@/actions/shopping-list/fetch"
import ShoppingListItems from "@/components/containers/shopping-list/shopping-list-items"

export default async function Page() {
  try {
    const shoppingList = await fetchShoppingList()
    return <ShoppingListItems shoppingList={shoppingList} />
  } catch (error) {
    console.error("Shopping list fetch error:", error)
    notFound()
  }
}
