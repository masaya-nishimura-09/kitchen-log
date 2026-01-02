import { z } from "zod"

export const PasswordFormSchema = z
  .object({
    password: z
      .string({
        message: "パスワードを入力してください。",
      })
      .min(6, { message: "パスワードは6文字以上で入力して下さい。" })
      .max(50, { message: "パスワードは50文字以内で入力して下さい。" }),
    confirmedPassword: z
      .string({
        message: "確認用パスワードを入力してください。",
      })
      .min(6, { message: "パスワードは6文字以上で入力して下さい。" })
      .max(50, { message: "パスワードは50文字以内で入力して下さい。" }),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    path: ["confirmedPassword"],
    message: "パスワードが一致しません。",
  })
