import Image from "next/image"
import Link from "next/link"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SetMeal } from "@/types/set-meal/set-meal"

export default function SetMeals({ setMeals }: { setMeals: SetMeal[] }) {
  return (
    <div className="size-full grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2">
      {setMeals.map((sm) => (
        <Link key={sm.id} href={`/dashboard/set-meal/${sm.id}`}>
          <Card className="aspect-video">
            <CardContent className="grid grid-cols-2 grid-rows-2 gap-2">
              {sm.recipes.slice(0, 4).map((r) => (
                <AspectRatio
                  key={r.id}
                  ratio={16 / 9}
                  className="bg-muted rounded-lg"
                >
                  {r.imageUrl ? (
                    <Image
                      src={`/api/recipe-image?path=${r.imageUrl}`}
                      alt="recipe image"
                      width={500}
                      height={300}
                      className="h-full w-full rounded-lg object-cover"
                      unoptimized
                    />
                  ) : (
                    <Image
                      src="/image-not-found/cover.png"
                      alt="recipe image"
                      width={500}
                      height={300}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  )}
                </AspectRatio>
              ))}
            </CardContent>
            <CardHeader>
              <CardTitle className="whitespace-nowrap overflow-hidden text-ellipsis">
                {sm.title}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
