import { notFound } from "next/navigation"
import { fetchSetMeal } from "@/actions/set-meal/fetch"
import RecipeCard from "@/components/containers/recipe/recipe-card"
import RecipeMenu from "@/components/containers/recipe/recipe-menu"
import SetMealMenu from "@/components/containers/set-meal/set-meal-menu"
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

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  const setMeal = await fetchSetMeal(Number(id))
  if (!setMeal) {
    notFound()
  }

  return (
    <div className="size-full">
      <Card className="size-full">
        <CardHeader>
          <CardTitle className="text-xl"> {setMeal.title}</CardTitle>
          {setMeal.memo && <CardDescription>{setMeal.memo}</CardDescription>}
          <CardAction>
            <SetMealMenu setMeal={setMeal} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Separator className="my-6" />
          {setMeal.recipes.length > 0 ? (
            <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
              {setMeal.recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  menuButton={<RecipeMenu recipe={recipe} />}
                  recipe={recipe}
                />
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
