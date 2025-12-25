"use server"

import { RecipeFormSchema } from "@/lib/schemas/recipe-form"
import type { RecipeState } from "@/types/recipe/recipe-input"

export async function addRecipe(
  _prevState: RecipeState | undefined,
  formData: FormData,
) {
  console.log(formData)
  const validatedFields = RecipeFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmedPassword: formData.get("confirmed-password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "レシピの登録に失敗しました。",
    }
  }
  // const {  } = validatedFields.data
}
