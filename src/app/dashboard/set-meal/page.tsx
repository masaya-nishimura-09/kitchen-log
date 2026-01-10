import { notFound } from "next/navigation"
import { fetchSetMeals } from "@/actions/set-meal/fetch"
import CreateButton from "@/components/containers/button/create-button"
import SetMealSearchForm from "@/components/containers/set-meal/search/set-meal-search-form"
import SetMeals from "@/components/containers/set-meal/set-meals"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { SetMealSearchParams } from "@/types/set-meal/set-meal-search-params"

export default async function Page({
  searchParams,
}: {
  searchParams: SetMealSearchParams
}) {
  const params = await searchParams

  const result = await fetchSetMeals(params)
  if (!result.success || !result.data) {
    notFound()
  }
  const setMeals = result.data

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>献立</CardTitle>
        <CardAction className="flex justify-end items-center gap-4">
          <SetMealSearchForm />
          <CreateButton link="/dashboard/set-meal/new" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <SetMeals setMeals={setMeals} size="md" />
      </CardContent>
    </Card>
  )
}
