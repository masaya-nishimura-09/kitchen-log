"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useTransition } from "react"
import { signIn } from "@/actions/auth/auth"
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

export default function SignInForm() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<AppActionResult>({
    success: false,
  })

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await signIn(formData)
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
        <CardTitle>ログイン</CardTitle>
        <CardAction>
          <Button variant="link">
            <Link href="/sign-up">会員登録</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="sign-in-form" action={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                name="email"
                type="text"
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
              <div className="flex items-center">
                <Label htmlFor="password">パスワード</Label>
                <a
                  href="/login/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  パスワードを忘れた場合
                </a>
              </div>
              <Input id="password" name="password" type="password" />
              <div aria-live="polite" aria-atomic="true">
                {state?.errors?.password?.map((error: string) => (
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
          form="sign-in-form"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          {isPending ? "ログイン中..." : "ログイン"}
        </Button>
      </CardFooter>
    </Card>
  )
}
