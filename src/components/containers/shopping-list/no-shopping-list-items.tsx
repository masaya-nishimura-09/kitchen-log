import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NoShoppingListItems() {
  return (
    <Card className="w-xs md:w-md m-auto">
      <CardHeader>
        <CardTitle>買い物リストにまだアイテムが登録されていません</CardTitle>
        <CardDescription>最初のアイテムを登録してみましょう。</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>
          <Link href="/dashboard/shopping-list/new">新規作成</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
