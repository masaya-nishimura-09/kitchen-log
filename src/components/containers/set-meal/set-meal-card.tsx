import Image from "next/image"
import Link from "next/link"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import type { SetMeal } from "@/types/set-meal/set-meal"

export default function SetMealCard({ setMeal }: { setMeal: SetMeal }) {
  return (
    <Link
      key={setMeal.id}
      href={`/dashboard/set-meal/${setMeal.id}`}
      className="aspect-video flex flex-col gap-2 rounded-lg bg-popover hover:bg-muted transition-colors p-2"
    >
      <AspectRatio
        className="grid grid-cols-2 grid-rows-2 gap-0 bg-muted rounded-lg overflow-hidden"
        ratio={16 / 9}
      >
        {setMeal.recipes.slice(0, 4).map((r) => (
          <AspectRatio key={r.id} ratio={16 / 9} className="bg-muted">
            <Image
              src={
                r.imageUrl
                  ? `/api/recipe-image?path=${r.imageUrl}`
                  : "/image-not-found/cover.png"
              }
              alt="recipe image"
              width={500}
              height={300}
              className="h-full w-full object-cover"
              unoptimized
            />
          </AspectRatio>
        ))}
      </AspectRatio>
      <p className="whitespace-nowrap overflow-hidden text-ellipsis font-semibold">
        {setMeal.title}
      </p>
    </Link>
  )
}
