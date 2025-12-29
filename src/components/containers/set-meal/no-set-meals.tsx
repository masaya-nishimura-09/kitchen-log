import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NoSetMeals() {
  return (
    <Card className="w-xs md:w-md m-auto">
      <CardHeader>
        <CardTitle>献立がまだ登録されていません</CardTitle>
        <CardDescription>最初の献立を作成してみましょう。</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>
          <Link href="/dashboard/set-meal/new">新規作成</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
