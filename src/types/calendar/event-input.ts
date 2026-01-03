export interface EventInput {
  recipeId: number | null
  date: string
  memo: string
}

export interface EventState {
  success: boolean
  errors?: {
    recipeId?: string[]
    date?: string[]
    memo?: string[]
  }
  message?: string | null
}
