import { notFound } from "next/navigation"
import {
  fetchIngredients,
  fetchRecipes,
  fetchTags,
} from "@/actions/recipe/fetch"
import CreateButton from "@/components/containers/button/create-button"
import Recipes from "@/components/containers/recipe/recipes"
import RecipeSearchForm from "@/components/containers/recipe/search/recipe-search-form"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { RecipeSearchParams } from "@/types/recipe/recipe-search-params"

export default async function Page({
  searchParams,
}: {
  searchParams: RecipeSearchParams
}) {
  const params = await searchParams

  const recipesResult = await fetchRecipes(params)
  const ingredientsResult = await fetchIngredients()
  const tagsResult = await fetchTags()

  if (
    !recipesResult.success ||
    !recipesResult.data ||
    !ingredientsResult.success ||
    !ingredientsResult.data ||
    !tagsResult.success ||
    !tagsResult.data
  ) {
    notFound()
  }

  const recipes = recipesResult.data
  const ingredients = ingredientsResult.data
  const tags = tagsResult.data

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>レシピ</CardTitle>
        <CardAction className="flex justify-end items-center gap-4">
          <RecipeSearchForm ingredients={ingredients} tags={tags} />
          <CreateButton link="/dashboard/recipe/new" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Recipes recipes={recipes} size="md" />
      </CardContent>
    </Card>
  )
}
