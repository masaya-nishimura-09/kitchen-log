import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NoRecipes() {
  return (
    <Card className="w-xs md:w-md m-auto">
      <CardHeader>
        <CardTitle>レシピがまだ登録されていません</CardTitle>
        <CardDescription>最初のレシピを作成してみましょう。</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>
          <Link href="/dashboard/recipe/new">新規作成</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
