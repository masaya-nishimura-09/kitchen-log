import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import DeleteUserForm from "@/components/containers/setting/delete-user"
import EmailForm from "@/components/containers/setting/email-form"
import PasswordForm from "@/components/containers/setting/password-form"
import SignOutForm from "@/components/containers/setting/sign-out"
import UsernameForm from "@/components/containers/setting/username-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/server"

export default async function Page() {
  const supabase = createClient(cookies())
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user?.user_metadata.name || !user?.email) {
    notFound()
  }

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>設定</CardTitle>
        <CardDescription>ユーザー情報を変更できます。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 max-w-lg">
        <UsernameForm username={user.user_metadata.name} />
        <Separator className="my-6" />
        <EmailForm email={user.email} />
        <Separator className="my-6" />
        <PasswordForm />
        <Separator className="my-6" />
        <SignOutForm />
        <DeleteUserForm />
      </CardContent>
    </Card>
  )
}
