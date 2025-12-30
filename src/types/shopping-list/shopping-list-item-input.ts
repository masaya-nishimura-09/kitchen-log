export interface ShoppingListItemInput {
  id: number
  name: string
  amount: string
  unit: string
  status: boolean
}

export interface ShoppingListItemState {
  success: boolean
  errors?: {
    name?: string[]
    amount?: string[]
    unit?: string[]
    status?: string[]
  }
  message?: string | null
}
