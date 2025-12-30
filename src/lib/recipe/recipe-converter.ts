import type { Recipe } from "@/types/recipe/recipe"
import type { RecipeRaw } from "@/types/recipe/recipe-raw"

export function recipeConverter(data: RecipeRaw): Recipe {
  return {
    id: data.id as number,
    userId: data.user_id as string,
    title: data.title as string,
    imageUrl: data.image_url as string | null,
    memo: data.memo as string | null,
    updatedAt: data.updated_at as string,
    createdAt: data.created_at as string,
    tag: data.tags.map((t) => ({
      id: t.id as number,
      recipeId: t.recipe_id as number,
      userId: t.user_id as string,
      name: t.name as string,
      updatedAt: t.updated_at as string,
      createdAt: t.created_at as string,
    })),
    ingredient: data.ingredients
      .map((i) => ({
        id: i.id as number,
        recipeId: i.recipe_id as number,
        userId: i.user_id as string,
        name: i.name as string,
        amount: i.amount as string | null,
        unit: i.unit as string,
        order: i.order as number,
        updatedAt: i.updated_at as string,
        createdAt: i.created_at as string,
      }))
      .sort((a, b) => a.order - b.order),
    step: data.steps
      .map((s) => ({
        id: s.id as number,
        recipeId: s.recipe_id as number,
        userId: s.user_id as string,
        text: s.text as string,
        order: s.order as number,
        updatedAt: s.updated_at as string,
        createdAt: s.created_at as string,
      }))
      .sort((a, b) => a.order - b.order),
  }
}
