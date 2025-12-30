import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchShoppingList } from "@/actions/shopping-list/fetch"
import NoShoppingListItems from "@/components/containers/shopping-list/no-shopping-list-items"
import ShoppingListItems from "@/components/containers/shopping-list/shopping-list-items"
import { Button } from "@/components/ui/button"
import type { ShoppingListItem } from "@/types/shopping-list/shopping-list-item"

export default async function Page() {
  try {
    const shoppingList = await fetchShoppingList()
    return <ShoppingListPage shoppingList={shoppingList} />
  } catch (error) {
    console.error("Shopping list fetch error:", error)
    notFound()
  }
}

// function ShoppingListPage({ shoppingList }: { shoppingList: ShoppingListItem[] }) {
//   return (
//     <div className="size-full flex flex-col gap-2">
//       <div className="flex w-full justify-end items-center gap-2">
//         <Button type="button">
//           <Link href="/dashboard/shopping-list/new">新規追加</Link>
//         </Button>
//       </div>
//       {shoppingList.length > 0 ? <ShoppingListItems shoppingList={shoppingList} /> : <NoShoppingListItems />}
//     </div>
//   )
// }

function ShoppingListPage({ shoppingList }: { shoppingList: ShoppingListItem[] }) {
  return (
    <div className="size-full flex flex-col gap-2">
      <div className="flex w-full justify-end items-center gap-2">
        <Button type="button">
          <Link href="/dashboard/shopping-list/new">新規追加</Link>
        </Button>
      </div>
      <ShoppingListItems shoppingList={shoppingList} /> 
    </div>
  )
}
