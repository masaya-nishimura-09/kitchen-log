import { z } from "zod"

export const SignUpSchema = z
  .object({
    name: z
      .string({
        message: "ユーザーネームを入力してください。",
      })
      .min(1, { message: "ユーザーネームを入力して下さい。" }),
    email: z.email({ message: "メールアドレスの形式で入力して下さい。" }),
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
