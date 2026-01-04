import type { Ingredient, Tag } from "./recipe"

export interface RecipeSearch {
  title: string
  ingredients: Ingredient[]
  tags: Tag[]
}
