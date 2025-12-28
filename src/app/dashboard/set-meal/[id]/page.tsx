import { notFound } from "next/navigation"
import { fetchSetMeal } from "@/actions/set-meal/fetch"
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
    <div className="size-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <p>{setMeal.title}</p>
    </div>
  )
}
