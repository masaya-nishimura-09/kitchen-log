import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { SetMeal } from "@/types/set-meal/set-meal"
import SeeMoreButton from "../button/see-more-button"
import SetMeals from "./set-meals"

export default function LatestSetMeals({ setMeals }: { setMeals: SetMeal[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近追加した献立</CardTitle>
        <CardAction>
          <SeeMoreButton link="/dashboard/set-meal" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <SetMeals setMeals={setMeals} size="sm" />
      </CardContent>
    </Card>
  )
}
