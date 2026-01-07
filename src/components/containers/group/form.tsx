"use client"

import {useState, useTransition} from "react"
import {Button} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Spinner} from "@/components/ui/spinner"
import type {GroupFormInput, GroupFormState} from "@/types/group/group-form"
import {createGroup} from "@/actions/group/create"
import {Input} from "@/components/ui/input"

export default function GroupForm() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<GroupFormState>({
    success: true,
    message: null,
    errors: {},
  })

  const [formData, setFormDataAction] = useState<GroupFormInput>({
    name: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fd = new FormData()

    fd.append(
      "groupData",
      JSON.stringify({
        name: formData.name,
      }),
    )

    startTransition(async () => {
      const result = await createGroup(fd)
      if (!result.success) {
        setState(result)
      }
    })
  }

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>グループを作成</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form
          id="new-group-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-md"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="名前を入力してください"
              value={formData.name}
              onChange={(e) =>
                setFormDataAction({...formData, name: e.target.value})
              }
            />
            <div aria-live="polite" aria-atomic="true">
              {state?.errors?.name?.map((error: string) => (
                <p className="mt-2 text-red-500 text-sm" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>

          <div aria-live="polite" aria-atomic="true">
            {state?.message && (
              <p className="mt-2 text-red-500 text-sm">{state.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button type="submit" form="new-group-form" disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "登録中..." : "登録"}
        </Button>
      </CardFooter>
    </Card>
  )
}
