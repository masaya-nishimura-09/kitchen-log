export interface ShoppingListItem {
  id: number
  userId: string
  name: string
  amount: string | null
  unit: string
  status: boolean
  updatedAt: string
  createdAt: string
}
