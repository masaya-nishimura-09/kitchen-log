import { z } from "zod"

export const SignInSchema = z.object({
  email: z.email({ message: "メールアドレスの形式で入力して下さい。" }),
  password: z
    .string({
      message: "パスワードを入力してください。",
    })
    .min(6, { message: "パスワードは6文字以上で入力して下さい。" })
    .max(50, { message: "パスワードは50文字以内で入力して下さい。" }),
})
