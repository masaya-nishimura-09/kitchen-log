export interface ShoppingListItemRaw {
  id: number
  user_id: string
  name: string
  amount: string | null
  unit: string
  status: boolean
  updated_at: string
  created_at: string
}
