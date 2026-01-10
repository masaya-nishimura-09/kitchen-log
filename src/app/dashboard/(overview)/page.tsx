import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { fetchLatestRecipes } from "@/actions/recipe/fetch"
import { fetchLatestSetMeals } from "@/actions/set-meal/fetch"
import { fetchLatestShoppingList } from "@/actions/shopping-list/fetch"
import LatestRecipes from "@/components/containers/recipe/latest-recipes"
import LatestSetMeals from "@/components/containers/set-meal/latest-set-meals"
import LatestShoppingList from "@/components/containers/shopping-list/latest-shopping-list"
import { createClient } from "@/lib/supabase/server"

export default async function Page() {
  const supabase = createClient(cookies())
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user?.user_metadata.name) {
    notFound()
  }

  const latestRecipesResult = await fetchLatestRecipes(4)
  const latestSetMealsResult = await fetchLatestSetMeals(4)
  const latestShoppingListResult = await fetchLatestShoppingList(8)

  if (
    !latestRecipesResult.success ||
    !latestRecipesResult.data ||
    !latestSetMealsResult.success ||
    !latestSetMealsResult.data ||
    !latestShoppingListResult.success ||
    !latestShoppingListResult.data
  ) {
    notFound()
  }

  const latestRecipes = latestRecipesResult.data
  const latestSetMeals = latestSetMealsResult.data
  const latestShoppingList = latestShoppingListResult.data

  return (
    <div className="size-full flex flex-col gap-4">
      <div>
        <p className="text-md md:text-2xl font-bold">
          おかえりなさい、{user.user_metadata.name}さん
        </p>
      </div>
      <LatestRecipes recipes={latestRecipes} />
      <LatestSetMeals setMeals={latestSetMeals} />
      <LatestShoppingList shoppingList={latestShoppingList} />
    </div>
  )
}
