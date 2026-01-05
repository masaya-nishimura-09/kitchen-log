"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ShoppingListItem } from "@/types/shopping-list/shopping-list-item"
import ShoppingListForm from "./shopping-list-form"
import ShoppingListTable from "./shopping-list-table"
import CreateButton from "../button/create-button"

export default function ShoppingListItems({
  shoppingList,
}: {
  shoppingList: ShoppingListItem[]
}) {
  const undone = shoppingList.filter((i) => i.status === false)
  const done = shoppingList.filter((i) => i.status === true)

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>買い物リスト</CardTitle>
        <CardAction>
        <CreateButton link="/dashboard/shopping-list/new" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="undone" className="w-full">
          <TabsList>
            <TabsTrigger value="undone">未購入</TabsTrigger>
            <TabsTrigger value="done">購入済み</TabsTrigger>
          </TabsList>
          <TabsContent value="undone">
            <ShoppingListTable items={undone} />
          </TabsContent>
          <TabsContent value="done">
            <ShoppingListTable items={done} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
