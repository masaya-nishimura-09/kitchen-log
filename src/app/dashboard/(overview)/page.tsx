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
      <div className="size-full flex flex-col gap-4">
        <Information username={user.user_metadata.name} />
        <LatestRecipes recipes={latestRecipes} />
        <LatestSetMeals setMeals={latestSetMeals} />
        <LatestShoppingList shoppingList={latestShoppingList} />
      </div>
    )
  } catch (error) {
    console.error("Recipes fetch error:", error)
    throw error
  }
}
