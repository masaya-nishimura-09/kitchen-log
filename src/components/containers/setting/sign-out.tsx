"use client"

import { useTransition } from "react"
import { signOut } from "@/actions/auth/auth"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function SignOutForm() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <div>
      <Button
        variant="outline"
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
      >
        {isPending && <Spinner />}
        {isPending ? "ログアウト中..." : "ログアウト"}
      </Button>
    </div>
  )
}
