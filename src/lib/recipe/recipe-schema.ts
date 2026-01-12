import { z } from "zod"

export const RecipeSchema = z.object({
  id: z.number(),
  image: z
    .instanceof(File)
    .refine(
      (file) => !file || file.size <= 5000000,
      "ファイルサイズは5MB以下にしてください",
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ),
      "JPEG、PNG、WebP形式の画像のみアップロード可能です",
    )
    .nullable()
    .optional(),
  imageUrl: z.string().transform((val) => (val === "" ? null : val)),
  title: z
    .string()
    .min(1, { message: "タイトルを入力してください。" })
    .max(100, { message: "タイトルは100文字以内で入力して下さい。" }),
  memo: z
    .string()
    .max(500)
    .transform((val) => (val === "" ? null : val)),
  tag: z
    .array(
      z.object({
        name: z.string().min(1).max(20),
      }),
    )
    .max(20, { message: "タグは20個までです。" }),
  ingredient: z
    .array(
      z.object({
        name: z.string().min(1, { message: "材料名を入力してください。" }),
        amount: z.string().transform((val) => (val === "" ? null : val)),
        unit: z.string(),
        order: z.number(),
      }),
    )
    .min(1, { message: "材料を1つ以上入力してください。" }),
  step: z
    .array(
      z.object({
        text: z.string().min(1, { message: "手順を入力してください。" }),
        order: z.number(),
      }),
    )
    .min(1, { message: "手順を1つ以上入力してください。" }),
})
