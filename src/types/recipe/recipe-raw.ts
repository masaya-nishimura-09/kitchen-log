import type { IngredientRaw } from "./ingredient-raw"
import type { TagRaw } from "./tag-raw"

export interface RecipeRaw {
  id: number
  user_id: string
  title: string
  image_url: string | null
  memo: string | null
  updated_at: string
  created_at: string
  tags: Array<TagRaw>
  ingredients: Array<IngredientRaw>
  steps: Array<{
    id: number
    recipe_id: number
    user_id: string
    text: string
    order: number
    updated_at: string
    created_at: string
  }>
}
