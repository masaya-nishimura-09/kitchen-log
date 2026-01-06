import {notFound} from "next/navigation"
import {fetchRecipes} from "@/actions/recipe/fetch"
import {fetchSetMealInput} from "@/actions/set-meal/fetch"
import SetMealForm from "@/components/containers/set-meal/form/set-meal-form"

export default async function Page({params}: {params: {id: string}}) {
  const {id} = await params

  const setMeal = await fetchSetMealInput(Number(id))
  if (!setMeal) {
    notFound()
  }
  const recipes = await fetchRecipes(undefined)
  return <SetMealForm setMeal={setMeal} mode="edit" recipes={recipes} />
}
