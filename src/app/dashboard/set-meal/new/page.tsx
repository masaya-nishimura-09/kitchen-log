import { notFound } from "next/navigation"
import { fetchRecipes } from "@/actions/recipe/fetch"
import SetMealForm from "@/components/containers/set-meal/form/set-meal-form"

export default async function Page() {
  const result = await fetchRecipes(undefined)
  if (!result.success || !result.data) {
    notFound()
  }
  const recipes = result.data
  return <SetMealForm setMeal={null} mode="new" recipes={recipes} />
}
