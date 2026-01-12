import { z } from "zod"

export const GroupSchema = z.object({
  name: z.string().min(1, { message: "グループ名を入力してください。" }),
})
