import { notFound } from "next/navigation"
import { fetchRecipes } from "@/actions/recipe"
import type { Recipe } from "@/types/recipe/recipe"

export default async function Page() {
  try {
    const recipes = await fetchRecipes()
    return <RecipesPage recipes={recipes} />
  } catch (error) {
    console.error("Recipes fetch error:", error)
    notFound()
  }
}

function RecipesPage({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="size-full">
      {recipes.map((recipe) => (
        <div key={recipe.id}>{recipe.title}</div>
      ))}
    </div>
  )
}
