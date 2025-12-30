"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useShoppingListTable } from "@/hooks/use-shopping-list-table"
import type { ShoppingListItem } from "@/types/shopping-list/shopping-list-item"
import ShoppingListItemForm from "./shopping-list-item-form"
import ShoppingListTable from "./shopping-list-table"

export default function ShoppingListItems({
  shoppingList,
}: {
  shoppingList: ShoppingListItem[]
}) {
  const doneTable = useShoppingListTable(
    shoppingList.filter((i) => i.status === true),
  )
  const undoneTable = useShoppingListTable(
    shoppingList.filter((i) => i.status === false),
  )

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>買い物リスト</CardTitle>
        <CardAction>
          <ShoppingListItemForm />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="undone" className="w-full">
          <TabsList>
            <TabsTrigger value="undone">未購入</TabsTrigger>
            <TabsTrigger value="done">購入済み</TabsTrigger>
          </TabsList>
          <TabsContent value="undone">
            <ShoppingListTable table={undoneTable} />
          </TabsContent>
          <TabsContent value="done">
            <ShoppingListTable table={doneTable} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
