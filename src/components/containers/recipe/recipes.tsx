import clsx from "clsx"
import NoRecipes from "@/components/containers/recipe/no-recipes"
import type { Recipe } from "@/types/recipe/recipe"
import RecipeCard from "./recipe-card"
import RecipeMenu from "./recipe-menu"

export default function Recipes({
  recipes,
  size,
}: {
  recipes: Recipe[]
  size: string
}) {
  const containerClassName = clsx(
    "size-full grid",
    size === "sm" && "grid-cols-[repeat(auto-fill,minmax(200px,1fr))]",
    size === "md" && "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]",
  )

  if (recipes.length > 0) {
    return (
      <div className={containerClassName}>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            menuButton={<RecipeMenu recipe={recipe} />}
            recipe={recipe}
          />
        ))}
      </div>
    )
  } else {
    return <NoRecipes />
  }
}
