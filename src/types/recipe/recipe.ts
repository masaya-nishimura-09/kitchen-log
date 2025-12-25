export interface Recipe {
  id: number
  userId: string
  imageUrl: string | null
  title: string
  memo: string
  tag: Tag[]
  ingredient: Ingredient[]
  step: Step[]
  updatedAt: string
  createdAt: string
}

export interface Tag {
  id: number
  recipeId: number
  name: string
  updatedAt: string
  createdAt: string
}

export interface Ingredient {
  id: number
  recipeId: number
  name: string
  amount: string
  updatedAt: string
  createdAt: string
}

export interface Step {
  id: number
  recipeId: number
  text: string
  order: number
  updatedAt: string
  createdAt: string
}
