"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>500 - Page Not Found</CardTitle>
          <CardDescription>ご指定のページが見つかりません。</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => reset()}>戻る</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
