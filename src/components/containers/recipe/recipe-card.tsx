import Image from "next/image"
import Link from "next/link"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import type { Recipe } from "@/types/recipe/recipe"

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      key={recipe.id}
      href={`/dashboard/recipe/${recipe.id}`}
      className="aspect-video flex flex-col gap-2"
    >
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
        <Image
          src={
            recipe.imageUrl
              ? `/api/recipe-image?path=${recipe.imageUrl}`
              : "/image-not-found/cover.png"
          }
          alt="recipe image"
          width={500}
          height={300}
          className="h-full w-full rounded-lg object-cover"
          unoptimized
        />
      </AspectRatio>
      <p className="whitespace-nowrap overflow-hidden text-ellipsis font-semibold">
        {recipe.title}
      </p>
    </Link>
  )
}
