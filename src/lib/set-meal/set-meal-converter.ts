import { recipeConverter } from "@/lib/recipe/recipe-converter"
import type { SetMeal } from "@/types/set-meal/set-meal"
import type { SetMealRaw } from "@/types/set-meal/set-meal-raw"

export function setMealConverter(data: SetMealRaw): SetMeal {
  return {
    id: data.id as number,
    userId: data.user_id as string,
    title: data.title as string,
    memo: data.memo as string | null,
    updatedAt: data.updated_at as string,
    createdAt: data.created_at as string,
    recipes: data.set_meal_recipes.map((sr) => {
      const recipe = Array.isArray(sr.recipes) ? sr.recipes[0] : sr.recipes
      return recipeConverter(recipe)
    }),
  }
}
