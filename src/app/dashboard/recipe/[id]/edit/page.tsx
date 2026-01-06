import { notFound } from "next/navigation"
import { fetchRecipeInput } from "@/actions/recipe/fetch"
import RecipeForm from "@/components/containers/recipe/form/recipe-form"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  const recipe = await fetchRecipeInput(Number(id))
  if (!recipe) {
    notFound()
  }
  return <RecipeForm recipe={recipe} mode="edit" />
}
