import { notFound } from "next/navigation"
import {
  fetchIngredients,
  fetchRecipes,
  fetchTags,
} from "@/actions/recipe/fetch"
import CreateButton from "@/components/containers/button/create-button"
import Recipes from "@/components/containers/recipe/recipes"
import RecipeSearchForm from "@/components/containers/recipe/search/recipe-search-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RecipeSearchParams } from "@/types/recipe/recipe-search-params"

export default async function Page({
  searchParams,
}: {
  searchParams: RecipeSearchParams
}) {
  const params = await searchParams

  const recipes = await fetchRecipes(params)
  const ingredients = await fetchIngredients()
  const tags = await fetchTags()

  if (!recipes || !ingredients || !tags) {
    notFound()
  }

  return (
    <Card className="size-full">
      <CardHeader className="flex flex-col md:flex-row justify-between gap-2">
        <CardTitle>レシピ</CardTitle>
        <div className="flex justify-end items-center gap-4">
          <RecipeSearchForm ingredients={ingredients} tags={tags} />
          <CreateButton link="/dashboard/recipe/new" />
        </div>
      </CardHeader>
      <CardContent>
        <Recipes recipes={recipes} size="280" />
      </CardContent>
    </Card>
  )
}
