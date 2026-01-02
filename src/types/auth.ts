export interface SignUpState {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    confirmedPassword?: string[]
  }
  message?: string | null
}

export type SignInState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string | null
}

export type UsernameState = {
  errors?: {
    username?: string[]
  }
  message?: string | null
}

export type EmailState = {
  errors?: {
    email?: string[]
  }
  message?: string | null
}

export type PasswordState = {
  errors?: {
    password?: string[]
    confirmedPassword?: string[]
  }
  message?: string | null
}
