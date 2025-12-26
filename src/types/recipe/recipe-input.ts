export interface RecipeInput {
  image: File | null
  title: string
  memo: string
  tag: TagInput[]
  ingredient: IngredientInput[]
  step: StepInput[]
}

export interface TagInput {
  name: string
}

export interface IngredientInput {
  id: string
  name: string
  amount: string
  unit: string
  order: number
}

export interface StepInput {
  id: string
  text: string
  order: number
}

export interface RecipeState {
  success: boolean
  errors?: {
    image?: string[]
    title?: string[]
    memo?: string[]
    tag?: string[]
    ingredient?: string[]
    step?: string[]
  }
  message?: string | null
}
