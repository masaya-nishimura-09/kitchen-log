"use client"

import { useState, useTransition } from "react"
import { updateEmail } from "@/actions/auth/update"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import type { AppActionResult } from "@/types/app-action-result"

export default function EmailForm({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<AppActionResult>({
    success: false,
  })

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateEmail(formData)
      if (!result.success) {
        setState(result)
      }
    })
  }

  return (
    <form className="grid gap-2" id="email-form" action={handleSubmit}>
      <Label htmlFor="email">メールアドレス</Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="m@example.com"
        defaultValue={email}
      />
      <div aria-live="polite" aria-atomic="true">
        {state?.errors?.email?.map((error: string) => (
          <p className="mt-2 text-red-500 text-sm" key={error}>
            {error}
          </p>
        ))}
      </div>
      <div>
        <Button type="submit" form="email-form" disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "メールアドレスを変更中..." : "メールアドレスを変更する"}
        </Button>
      </div>
    </form>
  )
}
