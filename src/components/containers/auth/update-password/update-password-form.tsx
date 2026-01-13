"use client"

import Image from "next/image"
import { useEffect, useState, useTransition } from "react"
import { resetPassword } from "@/actions/auth/update"
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
import { createClient } from "@/lib/supabase/client"
import type { AppActionResult } from "@/types/app-action-result"

export default function UpdatePasswordForm() {
  const supabase = createClient()

  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<AppActionResult>({
    success: false,
  })

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await resetPassword(formData)
      if (!result.success) {
        setState(result)
      }
    })
  }

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
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
                      {state?.errors?.confirmedPassword?.map(
                        (error: string) => (
                          <p className="mt-2 text-red-500 text-sm" key={error}>
                            {error}
                          </p>
                        ),
                      )}
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
      } else {
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
                パスワードリセット用メールをご確認ください。
              </CardTitle>
            </CardHeader>
          </Card>
        )
      }
    })
  }, [])
}
