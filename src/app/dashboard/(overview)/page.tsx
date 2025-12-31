import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { fetchLatestRecipes } from "@/actions/recipe/fetch"
import { fetchLatestSetMeals } from "@/actions/set-meal/fetch"
import { fetchLatestShoppingList } from "@/actions/shopping-list/fetch"
import Information from "@/components/containers/home/information"
import LatestRecipes from "@/components/containers/recipe/latest-recipes"
import LatestSetMeals from "@/components/containers/set-meal/latest-set-meals"
import LatestShoppingList from "@/components/containers/shopping-list/latest-shopping-list"
import { createClient } from "@/lib/supabase/server"

export default async function Page() {
  try {
    const supabase = createClient(cookies())
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user?.user_metadata.name) {
      notFound()
    }

    const latestRecipes = await fetchLatestRecipes(4)
    const latestSetMeals = await fetchLatestSetMeals(4)
    const latestShoppingList = await fetchLatestShoppingList(8)

    if (!latestRecipes || !latestSetMeals || !latestShoppingList) {
      notFound()
    }

    return (
      <div className="size-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-8">
          <Information username={user.user_metadata.name} />
          <LatestShoppingList shoppingList={latestShoppingList} />
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-4">
          <LatestRecipes recipes={latestRecipes} />
          <LatestSetMeals setMeals={latestSetMeals} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Recipes fetch error:", error)
    throw error
  }
}
