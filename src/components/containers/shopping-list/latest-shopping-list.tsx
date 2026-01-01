import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ShoppingListItem } from "@/types/shopping-list/shopping-list-item"

export default function LatestShoppingList({
  shoppingList,
}: {
  shoppingList: ShoppingListItem[]
}) {
  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>最近の買い物リスト</CardTitle>
        <CardAction>
          <Button variant="default">
            <Link href="/dashboard/shopping-list">もっと見る</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">名前</TableHead>
              <TableHead>量</TableHead>
              <TableHead>単位</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shoppingList.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
