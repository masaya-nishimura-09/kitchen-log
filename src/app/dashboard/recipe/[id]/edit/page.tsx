import { notFound } from "next/navigation"
import { fetchRecipeInput } from "@/actions/recipe/fetch"
import RecipeForm from "@/components/containers/recipe/form/recipe-form"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  const result = await fetchRecipeInput(Number(id))
  if (!result.success || !result.data) {
    notFound()
  }
  const recipe = result.data
  return <RecipeForm recipe={recipe} mode="edit" />
}
