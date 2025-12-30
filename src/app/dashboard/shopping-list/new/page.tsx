import RecipeForm from "@/components/containers/recipe/form"

export default async function Page() {
  return (
    <div className="size-full">
      <RecipeForm recipe={null} mode="new" />
    </div>
  )
}
