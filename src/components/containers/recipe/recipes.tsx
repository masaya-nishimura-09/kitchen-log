import NoRecipes from "@/components/containers/recipe/no-recipes"
import type { Recipe } from "@/types/recipe/recipe"
import RecipeCard from "./recipe-card"

export default function Recipes({
  recipes,
  size,
}: {
  recipes: Recipe[]
  size: string
}) {
  if (recipes.length > 0) {
    return (
      <div
        className={`size-full grid grid-cols-[repeat(auto-fill,minmax(${size}px,1fr))]`}
      >
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    )
  } else {
    return <NoRecipes />
  }
}
