import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ShoppingListItem } from "@/types/shopping-list/shopping-list-item"

export default function ShoppingListItems({ shoppingList }: { shoppingList: ShoppingListItem[] }) {
  return (
    <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2">
      {shoppingList.map((item) => (
          <Card key={item.id} className="aspect-video">
            <CardHeader>
              <CardTitle className="whitespace-nowrap overflow-hidden text-ellipsis">
                {item.name}
              </CardTitle>
            </CardHeader>
            <CardContent>yooo</CardContent>
          </Card>
      ))}
    </div>
  )
}
