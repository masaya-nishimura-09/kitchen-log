import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchSetMeal } from "@/actions/set-meal/fetch"
import RecipeCard from "@/components/containers/recipe/recipe-card"
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
import { Separator } from "@/components/ui/separator"
import type { SetMeal } from "@/types/set-meal/set-meal"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  try {
    const setMeal = await fetchSetMeal(Number(id))
    if (!setMeal) {
      notFound()
    }
    return <SetMealPage setMeal={setMeal} />
  } catch (error) {
    console.error("Set meal fetch error:", error)
    throw error
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
          <Separator className="my-6" />
          {setMeal.recipes.length > 0 ? (
            <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2">
              {setMeal.recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <p>レシピがありません。</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2" />
      </Card>
    </div>
  )
}
