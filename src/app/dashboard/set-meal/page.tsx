import { notFound } from "next/navigation"
import { fetchSetMeals } from "@/actions/set-meal/fetch"
import CreateButton from "@/components/containers/buttons/create-button"
import NoSetMeals from "@/components/containers/set-meal/no-set-meals"
import SetMealSearchForm from "@/components/containers/set-meal/search/set-meal-search-form"
import SetMealCard from "@/components/containers/set-meal/set-meal-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SetMealSearchParams } from "@/types/set-meal/set-meal-search-params"

export default async function Page({
  searchParams,
}: {
  searchParams: SetMealSearchParams
}) {
  const params = await searchParams

  const setMeals = await fetchSetMeals(params)
  if (!setMeals) {
    notFound()
  }

  return (
    <Card className="size-full">
      <CardHeader className="flex flex-col md:flex-row justify-between gap-2">
        <CardTitle>献立</CardTitle>
        <div className="flex justify-end items-center gap-2">
          <SetMealSearchForm />
          <CreateButton link="/dashboard/set-meal/new" />
        </div>
      </CardHeader>
      <CardContent>
        {setMeals.length > 0 ? (
          <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {setMeals.map((setMeal) => (
              <SetMealCard key={setMeal.id} setMeal={setMeal} />
            ))}
          </div>
        ) : (
          <NoSetMeals />
        )}
      </CardContent>
    </Card>
  )
}
