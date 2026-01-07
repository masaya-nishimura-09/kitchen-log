export interface GroupFormInput {
  name: string
}

export interface GroupFormState {
  success: boolean
  errors?: {
    name?: string[]
  }
  message?: string | null
}
