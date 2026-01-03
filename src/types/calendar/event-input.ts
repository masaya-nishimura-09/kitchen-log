export interface EventInput {
  recipeId: number | null
  date: string
}

export interface EventState {
  success: boolean
  errors?: {
    recipeId?: string[]
    date?: string[]
  }
  message?: string | null
}
