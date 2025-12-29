import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchSetMeal } from "@/actions/set-meal/fetch"
import Recipes from "@/components/containers/recipe/recipes"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { SetMeal } from "@/types/set-meal/set-meal"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  try {
    const setMeal = await fetchSetMeal(Number(id))
    return <SetMealPage setMeal={setMeal} />
  } catch (error) {
    console.error("Set meal fetch error:", error)
    notFound()
  }
}

function SetMealPage({ setMeal }: { setMeal: SetMeal }) {
  return (
    <div className="size-full">
      <Card className="size-full">
        <CardHeader>
          <CardTitle className="text-xl"> {setMeal.title}</CardTitle>
          {setMeal.memo && <CardDescription>{setMeal.memo}</CardDescription>}
          <CardAction>
            <Button>
              <Link href={`/dashboard/set-meal/${setMeal.id}/edit`}>
                編集する
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {setMeal.recipes.length > 0 ? (
            <Recipes recipes={setMeal.recipes} />
          ) : (
            <p>レシピがありません。</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2" />
      </Card>
    </div>
  )
}
