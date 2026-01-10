import { notFound } from "next/navigation"
import { fetchShoppingList } from "@/actions/shopping-list/fetch"
import ShoppingList from "@/components/containers/shopping-list/shopping-list"

export default async function Page() {
  const result = await fetchShoppingList()
  if (!result.success || !result.data) {
    notFound()
  }
  const shoppingList = result.data
  return <ShoppingList shoppingList={shoppingList} />
}
