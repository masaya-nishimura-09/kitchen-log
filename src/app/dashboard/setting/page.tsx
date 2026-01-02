import { cookies } from "next/headers"
import { notFound } from "next/navigation"
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
  try {
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
        <CardContent className="flex flex-col gap-6">
          <UsernameForm username={user.user_metadata.name} />
          <Separator className="my-2" />
          <EmailForm email={user.email} />
          <Separator className="my-2" />
          <PasswordForm />
          <Separator className="my-2" />
          <SignOutForm />
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error("User data fetch error:", error)
    throw error
  }
}
