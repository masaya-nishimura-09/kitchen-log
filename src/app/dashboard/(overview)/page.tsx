import { notFound } from "next/navigation"
import { fetchLatestRecipes } from "@/actions/recipe/fetch"
import { fetchLatestSetMeals } from "@/actions/set-meal/fetch"
import { fetchLatestShoppingList } from "@/actions/shopping-list/fetch"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import LatestRecipes from "@/components/containers/recipe/latest-recipes"
import LatestSetMeals from "@/components/containers/set-meal/latest-set-meals"

export default async function Page() {
  try {
    const supabase = createClient(cookies())
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user?.user_metadata.name) {
      notFound()
    }

    const latestRecipes = await fetchLatestRecipes(4)
    const latestSetMeals = await fetchLatestSetMeals(4)
    const latestShoppingList = await fetchLatestShoppingList(4)

    if (!latestRecipes || !latestSetMeals || !latestShoppingList) {
      notFound()
    }

    return (
      <div className="size-full flex flex-col gap-2">
        <div>
          <p>おかえりなさい、{user.user_metadata.name}さん</p>
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
