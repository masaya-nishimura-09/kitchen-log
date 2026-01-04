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
    <Card className="w-xs md:w-md">
      <CardHeader>
        <CardTitle>レシピがありません</CardTitle>
        <CardDescription>レシピを作成してみましょう。</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>
          <Link href="/dashboard/recipe/new">新規作成</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
