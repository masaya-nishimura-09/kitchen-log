import { z } from "zod"

export const UsernameFormSchema = z.object({
  username: z
    .string({
      message: "ユーザーネームを入力してください。",
    })
    .min(1, { message: "ユーザーネームを入力して下さい。" }),
})
