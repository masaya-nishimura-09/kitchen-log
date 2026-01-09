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
  if (setMeals.length > 0) {
    return (
      <div
        className={`size-full grid grid-cols-[repeat(auto-fill,minmax(${size}px,1fr))]`}
      >
        {setMeals.map((setMeal) => (
          <SetMealCard key={setMeal.id} setMeal={setMeal} />
        ))}
      </div>
    )
  } else {
    return <NoSetMeals />
  }
}
