import { z } from "zod"

export const EmailFormSchema = z.object({
  email: z.email({ message: "メールアドレスの形式で入力して下さい。" }),
})
