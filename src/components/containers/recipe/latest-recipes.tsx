import Link from "next/link"
import RecipeCard from "@/components/containers/recipe/recipe-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Recipe } from "@/types/recipe/recipe"

export default function LatestRecipes({ recipes }: { recipes: Recipe[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近のレシピ</CardTitle>
        <CardAction>
          <Button variant="default">
            <Link href="/dashboard/recipe">もっと見る</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {recipes.length > 0 ? (
          <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p>レシピがありません</p>
        )}
      </CardContent>
    </Card>
  )
}
