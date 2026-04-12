import { z } from "zod"

export const ShoppingListItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "材料名を入力してください。" }),
  amount: z
    .string({ message: "量を入力してください。" })
    .transform((val) => (val === "" ? null : val)),
  unit: z.string({ message: "単位を入力してください。" }),
  status: z.boolean({ message: "状態を入力してください。" }),
})

export const DeleteShoppingListItemSchema = z.object({
  id: z.number(),
})
