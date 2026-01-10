"use client"

import { useState, useTransition } from "react"
import { updateUsername } from "@/actions/auth/update"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import type { AppActionResult } from "@/types/app-action-result"

export default function UsernameForm({ username }: { username: string }) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<AppActionResult>({
    success: false,
  })

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateUsername(formData)
      if (!result.success) {
        setState(result)
      }
    })
  }

  return (
    <form className="grid gap-2" id="username-form" action={handleSubmit}>
      <Label htmlFor="username">ユーザーネーム</Label>
      <Input
        id="username"
        name="username"
        type="text"
        placeholder="ユーザーネームを入力して下さい"
        defaultValue={username}
      />
      <div aria-live="polite" aria-atomic="true">
        {state?.errors?.username?.map((error: string) => (
          <p className="mt-2 text-red-500 text-sm" key={error}>
            {error}
          </p>
        ))}
      </div>
      <div>
        <Button
          className=""
          type="submit"
          form="username-form"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          {isPending ? "ユーザーネームを変更中..." : "ユーザーネームを変更する"}
        </Button>
      </div>
    </form>
  )
}
