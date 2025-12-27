import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "404 - Page Not Found",
}

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>404 - Page Not Found</CardTitle>
          <CardDescription>ご指定のページが見つかりません。</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>
            <Link href="/dashboard">トップページへ戻る</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
