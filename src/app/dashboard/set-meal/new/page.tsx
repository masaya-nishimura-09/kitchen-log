import { notFound } from "next/navigation"
import { fetchRecipes } from "@/actions/recipe/fetch"
import SetMealForm from "@/components/containers/set-meal/form"

export default async function Page() {
  try {
    const recipes = await fetchRecipes(undefined)
    return <SetMealForm setMeal={null} mode="new" recipes={recipes} />
  } catch (error) {
    console.error("Recipes fetch error:", error)
    notFound()
  }
}
