export interface RecipeRaw {
  id: number
  user_id: string
  title: string
  image_url: string | null
  memo: string | null
  updated_at: string
  created_at: string
  tags: Array<{
    id: number
    recipe_id: number
    user_id: string
    name: string
    updated_at: string
    created_at: string
  }>
  ingredients: Array<{
    id: number
    recipe_id: number
    user_id: string
    name: string
    amount: string
    unit: string
    order: number
    updated_at: string
    created_at: string
  }>
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
