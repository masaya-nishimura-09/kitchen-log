import Link from "next/link"
import SetMealCard from "@/components/containers/set-meal/set-meal-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { SetMeal } from "@/types/set-meal/set-meal"

export default function LatestSetMeals({ setMeals }: { setMeals: SetMeal[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近追加した献立</CardTitle>
        <CardAction>
          <Button variant="default">
            <Link href="/dashboard/set-meal">もっと見る</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {setMeals.length > 0 ? (
          <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
            {setMeals.map((setMeal) => (
              <SetMealCard key={setMeal.id} setMeal={setMeal} />
            ))}
          </div>
        ) : (
          <p>献立がありません</p>
        )}
      </CardContent>
    </Card>
  )
}
