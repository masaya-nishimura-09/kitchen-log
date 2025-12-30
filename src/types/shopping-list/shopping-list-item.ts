export interface ShoppingListItem {
  id: number
  userId: string
  name: string
  amount: string | null
  unit: string
  updatedAt: string
  createdAt: string
}
