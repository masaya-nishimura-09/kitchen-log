import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Recipe } from "@/types/recipe/recipe"
import RecipeCard from "@/components/containers/recipe/recipe-card"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LatestRecipes({ recipes }: { recipes: Recipe[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近のレシピ</CardTitle>
      </CardHeader>
      <CardContent>
        {recipes.length > 0 ? (
          <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ): <p>レシピがありません</p>
        }
      </CardContent>
      <CardFooter>
        <Button variant="default"> 
          <Link href="/dashboard/recipe">
            もっと見る
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
