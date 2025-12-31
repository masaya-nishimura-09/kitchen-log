import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { ShoppingListItem } from "@/types/shopping-list/shopping-list-item"

export default function LatestShoppingList({ shoppingList }: { shoppingList: ShoppingListItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近の買い物リスト</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">名前</TableHead>
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
      <CardFooter>
        <Button variant="default">
          <Link href="/dashboard/shopping-list">もっと見る</Link>
        </Button>
      </CardFooter>
    </Card>
  ) 
}
