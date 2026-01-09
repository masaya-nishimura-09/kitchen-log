import { notFound } from "next/navigation"
import { fetchSetMeal } from "@/actions/set-meal/fetch"
import Recipes from "@/components/containers/recipe/recipes"
import SetMealMenu from "@/components/containers/set-meal/set-meal-menu"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  const setMeal = await fetchSetMeal(Number(id))
  if (!setMeal) {
    notFound()
  }

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle className="text-xl"> {setMeal.title}</CardTitle>
        {setMeal.memo && <CardDescription>{setMeal.memo}</CardDescription>}
        <CardAction>
          <SetMealMenu setMeal={setMeal} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Recipes recipes={setMeal.recipes} size={"280"} />
      </CardContent>
    </Card>
  )
}
