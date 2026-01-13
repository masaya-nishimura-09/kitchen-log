"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { UpdatePasswordSchema } from "@/lib/auth/update-password-schema"
import { createClient } from "@/lib/supabase/client"
import type { AppActionResult } from "@/types/app-action-result"

export default function UpdatePasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<AppActionResult>({
    success: false,
  })

  const router = useRouter()

  const supabase = createClient()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const validatedFields = UpdatePasswordSchema.safeParse({
        password: formData.get("password"),
        confirmedPassword: formData.get("confirmed-password"),
      })

      if (!validatedFields.success) {
        setState({
          success: false,
          errors: validatedFields.error.flatten().fieldErrors,
          message: "入力内容に誤りがあります。",
        })
        return
      }

      const { password } = validatedFields.data

      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setState({
          success: false,
          message: "パスワードの変更に失敗しました。",
        })
        return
      }
      router.push("/sign-in")
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
        <CardTitle>パスワードのリセット</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="reset-password-form" action={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">新規パスワード</Label>
              <Input id="password" name="password" type="password" />
              <div aria-live="polite" aria-atomic="true">
                {state?.errors?.password?.map((error: string) => (
                  <p className="mt-2 text-red-500 text-sm" key={error}>
                    {error}
                  </p>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmed-password">確認用パスワード</Label>
              <Input
                id="confirmed-password"
                name="confirmed-password"
                type="password"
              />
              <div aria-live="polite" aria-atomic="true">
                {state?.errors?.confirmedPassword?.map((error: string) => (
                  <p className="mt-2 text-red-500 text-sm" key={error}>
                    {error}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div aria-live="polite" aria-atomic="true">
            {state?.message && (
              <p className="mt-2 text-red-500 text-sm">{state.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          type="submit"
          className="w-full"
          form="reset-password-form"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          {isPending ? "登録中..." : "登録"}
        </Button>
      </CardFooter>
    </Card>
  )
}
