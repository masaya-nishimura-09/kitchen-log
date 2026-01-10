"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useTransition } from "react"
import { signUp } from "@/actions/auth/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import type { AppActionResult } from "@/types/app-action-result"

export default function SignUpForm() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<AppActionResult>({
    success: false,
  })

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await signUp(formData)
      if (!result.success) {
        setState(result)
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
        <CardTitle>会員登録</CardTitle>
        <CardAction>
          <Button variant="link">
            <Link href="/sign-in">ログイン</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="sign-up-form" action={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">ユーザーネーム</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="ユーザーネームを入力して下さい"
              />
              <div aria-live="polite" aria-atomic="true">
                {state?.errors?.name?.map((error: string) => (
                  <p className="mt-2 text-red-500 text-sm" key={error}>
                    {error}
                  </p>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">パスワード</Label>
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
          form="sign-up-form"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          {isPending ? "登録中..." : "登録"}
        </Button>
      </CardFooter>
    </Card>
  )
}
