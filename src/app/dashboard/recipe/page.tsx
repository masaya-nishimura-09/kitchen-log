import Link from "next/link"
import { notFound } from "next/navigation"
import {
  fetchIngredients,
  fetchRecipes,
  fetchTags,
} from "@/actions/recipe/fetch"
import NoRecipes from "@/components/containers/recipe/no-recipes"
import RecipeCard from "@/components/containers/recipe/recipe-card"
import RecipeSearch from "@/components/containers/recipe/search/recipe-search"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SearchParams } from "@/types/recipe/search-params"

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams
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
        <div className="flex justify-end items-center gap-2">
          <RecipeSearch ingredients={ingredients} tags={tags} />
          <Button type="button">
            <Link href="/dashboard/recipe/new">新規追加</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recipes.length > 0 ? (
          <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <NoRecipes />
        )}
      </CardContent>
    </Card>
  )
}
