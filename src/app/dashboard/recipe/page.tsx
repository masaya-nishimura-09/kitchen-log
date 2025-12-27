import { Search } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchRecipes } from "@/actions/recipe"
import Recipes from "@/components/containers/recipe/recipes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Recipe } from "@/types/recipe/recipe"
import type { SearchParams } from "@/types/recipe/search-params"

export default async function Page(props: {
  searchParams?: Promise<SearchParams>
}) {
  const searchParams = await props.searchParams

  try {
    const recipes = await fetchRecipes(searchParams)
    return <RecipesPage recipes={recipes} />
  } catch (error) {
    console.error("Recipes fetch error:", error)
    notFound()
  }
}

function RecipesPage({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="size-full flex flex-col gap-2">
      <div className="flex w-full items-center gap-2">
        <div className="relative max-w-xl">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="検索..." className="pl-8" />
        </div>
        <Button type="button" className="ml-auto">
          <Link href="/dashboard/recipe/new">新規追加</Link>
        </Button>
      </div>
      <Recipes recipes={recipes} />
    </div>
  )
}
