import clsx from "clsx"
import type { SetMeal } from "@/types/set-meal/set-meal"
import NoSetMeals from "./no-set-meals"
import SetMealCard from "./set-meal-card"

export default function SetMeals({
  setMeals,
  size,
}: {
  setMeals: SetMeal[]
  size: string
}) {
  const containerClassName = clsx(
    "size-full grid",
    size === "sm" && "grid-cols-[repeat(auto-fill,minmax(200px,1fr))]",
    size === "md" && "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]",
  )

  if (setMeals.length > 0) {
    return (
      <div className={containerClassName}>
        {setMeals.map((setMeal) => (
          <SetMealCard key={setMeal.id} setMeal={setMeal} />
        ))}
      </div>
    )
  } else {
    return <NoSetMeals />
  }
}
