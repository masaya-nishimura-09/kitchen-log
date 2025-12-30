import { notFound } from "next/navigation"
import { fetchRecipeInput } from "@/actions/recipe/fetch"
import RecipeForm from "@/components/containers/recipe/form"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  try {
    const recipe = await fetchRecipeInput(Number(id))
    return <RecipeForm recipe={recipe} mode="edit" />
  } catch (error) {
    console.error("Recipe fetch error:", error)
    notFound()
  }
}
