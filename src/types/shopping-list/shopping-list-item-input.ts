export interface ShoppingListItemInput {
  id: number
  name: string
  amount: string
  unit: string
}

export interface ShoppingListItemState {
  success: boolean
  errors?: {
    name?: string[]
    amount?: string[]
    unit?: string[]
  }
  message?: string | null
}
