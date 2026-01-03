import { Search } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchRecipes } from "@/actions/recipe/fetch"
import NoRecipes from "@/components/containers/recipe/no-recipes"
import RecipeCard from "@/components/containers/recipe/recipe-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { SearchParams } from "@/types/recipe/search-params"

export default async function Page(props: {
  searchParams?: Promise<SearchParams>
}) {
  const searchParams = await props.searchParams

  const recipes = await fetchRecipes(searchParams)
  if (!recipes) {
    notFound()
  }

  return (
    <Card className="size-full">
      <CardHeader className="flex flex-col md:flex-row justify-between gap-2">
        <CardTitle>レシピ</CardTitle>
        <div className="flex justify-end items-center gap-2">
          <form method="GET" className="relative max-w-lg">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="title"
              placeholder="検索..."
              className="pl-8 w-full"
            />
          </form>
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
