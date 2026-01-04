import type { Tag } from "@/types/recipe/recipe"
import type { TagRaw } from "@/types/recipe/tag-raw"

export function tagConverter(data: TagRaw): Tag {
  return {
    id: data.id as number,
    recipeId: data.recipe_id as number,
    userId: data.user_id as string,
    name: data.name as string,
    updatedAt: data.updated_at as string,
    createdAt: data.created_at as string,
  }
}
