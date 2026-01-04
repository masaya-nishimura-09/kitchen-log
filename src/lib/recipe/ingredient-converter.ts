import type { IngredientRaw } from "@/types/recipe/ingredient-raw"
import type { Ingredient } from "@/types/recipe/recipe"

export function ingredientConverter(data: IngredientRaw): Ingredient {
  return {
    id: data.id as number,
    recipeId: data.recipe_id as number,
    userId: data.user_id as string,
    name: data.name as string,
    amount: data.amount as string | null,
    unit: data.unit as string,
    order: data.order as number,
    updatedAt: data.updated_at as string,
    createdAt: data.created_at as string,
  }
}
