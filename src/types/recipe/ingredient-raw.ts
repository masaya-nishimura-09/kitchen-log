export interface IngredientRaw {
  id: number
  recipe_id: number
  user_id: string
  name: string
  amount: string | null
  unit: string
  order: number
  updated_at: string
  created_at: string
}
