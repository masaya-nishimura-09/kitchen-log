export interface Recipe {
  id: number
  userId: string
  title: string
  imageUrl: string | null
  memo: string | null
  tag: Tag[]
  ingredient: Ingredient[]
  step: Step[]
  updatedAt: string
  createdAt: string
}

export interface Tag {
  id: number
  recipeId: number
  userId: string
  name: string
  updatedAt: string
  createdAt: string
}

export interface Ingredient {
  id: number
  recipeId: number
  userId: string
  name: string
  amount: string
  unit: string
  order: number
  updatedAt: string
  createdAt: string
}

export interface Step {
  id: number
  recipeId: number
  userId: string
  text: string
  order: number
  updatedAt: string
  createdAt: string
}
