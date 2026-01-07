"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CreateButton from "../button/create-button"

export default function Groups() {
  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>グループ</CardTitle>
        <CardAction>
          <CreateButton link="/dashboard/group/new" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}
