import Image from "next/image"
import { notFound } from "next/navigation"
import React from "react"
import { fetchRecipe } from "@/actions/recipe/fetch"
import RecipeMenu from "@/components/containers/recipe/recipe-menu"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  const recipe = await fetchRecipe(Number(id))
  if (!recipe) {
    notFound()
  }

  return (
    <div className="size-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl"> {recipe.title}</CardTitle>
          <CardAction>
            <RecipeMenu recipe={recipe} />
          </CardAction>
        </CardHeader>
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
        <CardFooter className="flex flex-col items-start gap-4">
          <div className="flex flex-wrap gap-2">
            {recipe.tag.map((t, index) => (
              <Badge key={`${t.name}-${index}`} variant="secondary">
                {t.name}
              </Badge>
            ))}
          </div>
          {recipe.memo && <CardDescription>{recipe.memo}</CardDescription>}
        </CardFooter>
      </Card>

      <Card className="size-ful">
        <Tabs defaultValue="ingredient" className="size-ful">
          <CardHeader>
            <CardTitle>
              <TabsList>
                <TabsTrigger value="ingredient">材料</TabsTrigger>
                <TabsTrigger value="step">手順</TabsTrigger>
              </TabsList>
            </CardTitle>
          </CardHeader>
          <CardContent className="size-ful">
            <TabsContent value="ingredient" className="size-ful p-2">
              <ScrollArea className="rounded-md size-ful">
                {recipe.ingredient.map((i) => (
                  <React.Fragment key={i.id}>
                    <div className="flex gap-2">
                      <div className="text-sm">{i.name}</div>
                      <div className="text-sm">...</div>
                      <div className="text-sm">{i.amount}</div>
                      <div className="text-sm">{i.unit}</div>
                    </div>
                    <Separator className="my-2" />
                  </React.Fragment>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="step" className="size-ful p-2">
              <ScrollArea className="rounded-md size-ful">
                {recipe.step.map((i) => (
                  <React.Fragment key={i.id}>
                    <div className="flex gap-2">
                      <div className="text-sm">{i.order}. </div>
                      <div className="text-sm">{i.text}</div>
                    </div>
                    <Separator className="my-2" />
                  </React.Fragment>
                ))}
              </ScrollArea>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
