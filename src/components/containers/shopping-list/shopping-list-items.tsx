"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import ShoppingListTable from "./shopping-list-table"

export default function ShoppingListItems({
  shoppingList,
}: {
  shoppingList: ShoppingListItem[]
}) {
  const [done, _setDone] = useState<ShoppingListItem[]>(
    shoppingList.filter((i) => i.status === true),
  )
  const [undone, _setUndone] = useState<ShoppingListItem[]>(
    shoppingList.filter((i) => i.status === false),
  )

  const doneTable = useShoppingListTable(done)
  const undoneTable = useShoppingListTable(undone)

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>買い物リスト</CardTitle>
        <CardAction>
          <Button variant="default">追加</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="undone" className="w-full">
          <TabsList>
            <TabsTrigger value="undone">未購入</TabsTrigger>
            <TabsTrigger value="done">購入済み</TabsTrigger>
          </TabsList>
          <TabsContent value="undone">
            <ShoppingListTable table={undoneTable.table} />
          </TabsContent>
          <TabsContent value="done">
            <ShoppingListTable table={doneTable.table} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
