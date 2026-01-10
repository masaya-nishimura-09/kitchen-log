import { notFound } from "next/navigation"
import { fetchRecipes } from "@/actions/recipe/fetch"
import { fetchSetMealInput } from "@/actions/set-meal/fetch"
import SetMealForm from "@/components/containers/set-meal/form/set-meal-form"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  const result = await fetchSetMealInput(Number(id))
  if (!result.success || !result.data) {
    notFound()
  }
  const setMeal = result.data
  const recipesResult = await fetchRecipes(undefined)
  if (!recipesResult.success || !recipesResult.data) {
    notFound()
  }
  const recipes = recipesResult.data
  return <SetMealForm setMeal={setMeal} mode="edit" recipes={recipes} />
}
