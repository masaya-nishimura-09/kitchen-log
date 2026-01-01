import { Search } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchSetMeals } from "@/actions/set-meal/fetch"
import NoSetMeals from "@/components/containers/set-meal/no-set-meals"
import SetMealCard from "@/components/containers/set-meal/set-meal-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { SearchParams } from "@/types/recipe/search-params"
import type { SetMeal } from "@/types/set-meal/set-meal"

export default async function Page(props: {
  searchParams?: Promise<SearchParams>
}) {
  const searchParams = await props.searchParams

  try {
    const setMeals = await fetchSetMeals(searchParams)
    if (!setMeals) {
      notFound()
    }
    return <SetMealsPage setMeals={setMeals} />
  } catch (error) {
    console.error("Set meals fetch error:", error)
    throw error
  }
}

function SetMealsPage({ setMeals }: { setMeals: SetMeal[] }) {
  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>献立</CardTitle>
        <CardAction className="flex w-full justify-end items-center gap-2">
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
            <Link href="/dashboard/set-meal/new">新規追加</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {setMeals.length > 0 ? (
          <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {setMeals.map((setMeal) => (
              <SetMealCard key={setMeal.id} setMeal={setMeal} />
            ))}
          </div>
        ) : (
          <NoSetMeals />
        )}
      </CardContent>
    </Card>
  )
}
