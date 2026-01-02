"use client"

import { useTransition } from "react"
import { Toaster, toast } from "sonner"
import { deleteUser } from "@/actions/auth/delete"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function DeleteUserForm() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        await deleteUser()
      } catch {
        toast.error("アカウントの削除に失敗しました。")
      }
    })
  }

  return (
    <AlertDialog>
      <Toaster richColors position="top-center" />

      <AlertDialogTrigger className="mr-auto">
        <Button variant="outline">アカウントを削除しますか？</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>アカウント削除</AlertDialogTitle>
          <AlertDialogDescription>
            このアカウントを本当に削除してもよろしいですか？
            この操作は元に戻せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleSubmit}>
            {isPending && <Spinner />}
            {isPending ? "アカウント削除中..." : "アカウント削除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
