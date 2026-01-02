"use client"

import { useActionState } from "react"
import { updatePassword } from "@/actions/auth/update"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import type { PasswordState } from "@/types/auth"

export default function PasswordForm() {
  const initialState: PasswordState = { message: null, errors: {} }

  const [state, formAction, isPending] = useActionState(
    updatePassword,
    initialState,
  )

  return (
    <form className="grid gap-2" id="password-form" action={formAction}>
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
