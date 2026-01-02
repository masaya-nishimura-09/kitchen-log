import { notFound } from "next/navigation"
import { fetchRecipes } from "@/actions/recipe/fetch"
import SetMealForm from "@/components/containers/set-meal/form"

export default async function Page() {
  const recipes = await fetchRecipes(undefined)
  if (!recipes) {
    notFound()
  }
  return <SetMealForm setMeal={null} mode="new" recipes={recipes} />
}
