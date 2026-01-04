import RecipeCard from "@/components/containers/recipe/recipe-card"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Recipe } from "@/types/recipe/recipe"
import SeeMoreButton from "../buttons/see-more-button"

export default function LatestRecipes({ recipes }: { recipes: Recipe[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近追加したレシピ</CardTitle>
        <CardAction>
          <SeeMoreButton link="/dashboard/recipe" />
        </CardAction>
      </CardHeader>
      <CardContent>
        {recipes.length > 0 ? (
          <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
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
