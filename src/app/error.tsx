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
          <CardTitle>500 - Internal Server Error</CardTitle>
          <CardDescription>アプリ側で問題が発生しました。</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => reset()}>戻る</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
