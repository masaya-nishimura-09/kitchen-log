import Image from "next/image"
import Link from "next/link"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Recipe } from "@/types/recipe/recipe"

export default function Recipes({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2">
      {recipes.map((recipe) => (
        <Link key={recipe.id} href={`/dashboard/recipe/${recipe.id}`}>
          <Card className="aspect-video">
            <CardContent>
              {recipe.imageUrl ? (
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                  <Image
                    src={`/api/recipe-image?path=${recipe.imageUrl}`}
                    alt="recipe image"
                    width={500}
                    height={300}
                    className="h-full w-full rounded-lg object-cover"
                    unoptimized
                  />
                </AspectRatio>
              ) : (
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                  <Image
                    src="/image-not-found/cover.png"
                    alt="recipe image"
                    width={500}
                    height={300}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </AspectRatio>
              )}
            </CardContent>
            <CardHeader>
              <CardTitle className="whitespace-nowrap overflow-hidden text-ellipsis">
                {recipe.title}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
