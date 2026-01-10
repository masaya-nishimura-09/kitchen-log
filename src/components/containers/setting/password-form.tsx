"use client"

import { useState, useTransition } from "react"
import { updatePassword } from "@/actions/auth/update"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import type { AppActionResult } from "@/types/app-action-result"

export default function PasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<AppActionResult>({
    success: false,
  })

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updatePassword(formData)
      if (!result.success) {
        setState(result)
      }
    })
  }

  return (
    <form className="grid gap-2" id="password-form" action={handleSubmit}>
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

      <div>
        <Button type="submit" form="password-form" disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "パスワードを変更中..." : "パスワードを変更する"}
        </Button>
      </div>
    </form>
  )
}
