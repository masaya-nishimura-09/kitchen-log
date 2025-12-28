import SetMealForm from "@/components/containers/set-meal/form"

export default async function Page() {
  return (
    <div className="size-full">
      <SetMealForm setMeal={null} mode="new" />
    </div>
  )
}
