import { z } from "zod"

export const ShoppingListItemUpdateFormSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string().min(1, { message: "材料名を入力してください。" }),
    amount: z.string().transform((val) => (val === "" ? null : val)),
    unit: z.string(),
    status: z.boolean(),
  }),
)
