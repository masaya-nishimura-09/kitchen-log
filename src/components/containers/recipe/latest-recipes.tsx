import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Recipe } from "@/types/recipe/recipe"
import SeeMoreButton from "../buttons/see-more-button"
import Recipes from "./recipes"

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
        <Recipes recipes={recipes} size="200" />
      </CardContent>
    </Card>
  )
}
