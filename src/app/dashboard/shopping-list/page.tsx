import { notFound } from "next/navigation"
import { fetchShoppingList } from "@/actions/shopping-list/fetch"
import ShoppingList from "@/components/containers/shopping-list/shopping-list"

export default async function Page() {
  const shoppingList = await fetchShoppingList()
  if (!shoppingList) {
    notFound()
  }
  return <ShoppingList shoppingList={shoppingList} />
}
