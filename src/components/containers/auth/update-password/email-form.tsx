"use client"

import Image from "next/image"
import {useState, useTransition} from "react"
import {Toaster, toast} from "sonner"
import {sendResetPasswordEmail} from "@/actions/auth/update"
import {Button} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Spinner} from "@/components/ui/spinner"
import type {AppActionResult} from "@/types/app-action-result"

export default function EmailForm() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<AppActionResult>({
    success: false,
  })

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await sendResetPasswordEmail(formData)
      if (!result.success) {
        setState(result)
      } else {
        toast.success(
          "入力していただいたメールアドレス宛にパスワードリセット用メールを送信しました。",
        )
      }
    })
  }

  return (
    <Card className="mx-4 w-sm md:w-md">
      <Image
        src={"/logo/logo/vector/default-monochrome.svg"}
        alt="logo"
        width={130}
        height={54}
        className="mx-auto py-4"
      />
      <CardHeader>
        <CardTitle>
          メールアドレス
        </CardTitle>
        <CardDescription>
          パスワード再設定の案内を受け取るメールアドレスを入力してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-2" id="email-form" action={handleSubmit}>
          <Toaster richColors position="top-center" />
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
          />
          <div aria-live="polite" aria-atomic="true">
            {state?.errors?.email?.map((error: string) => (
              <p className="mt-2 text-red-500 text-sm" key={error}>
                {error}
              </p>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          type="submit"
          className="w-full"
          form="email-form"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          {isPending ? "メールを送信中..." : "確定"}
        </Button>
      </CardFooter>
    </Card>
  )
}
