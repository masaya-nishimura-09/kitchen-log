import Image from "next/image"
import Link from "next/link"
import { useTransition } from "react"
import { deleteEvent } from "@/actions/calendar/delete"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import type { Recipe } from "@/types/recipe/recipe"

export default function CalendarEventCard({
  selectedRecipe,
  selectedEventId,
  selectedEventDate,
}: {
  selectedRecipe: Recipe | null
  selectedEventId: number | null
  selectedEventDate: string
}) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedEventId == null) return

    startTransition(async () => {
      await deleteEvent(selectedEventId)
    })
  }

  return (
    <DialogContent>
      {selectedRecipe && (
        <div className="flex flex-col gap-4">
          <DialogHeader className="flex flex-col gap-4">
            <DialogTitle>{selectedRecipe?.title}</DialogTitle>
            <DialogDescription>{selectedEventDate}</DialogDescription>
          </DialogHeader>
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
            <Image
              src={
                selectedRecipe.imageUrl
                  ? `/api/recipe-image?path=${selectedRecipe.imageUrl}`
                  : "/image-not-found/cover.png"
              }
              alt="recipe image"
              width={500}
              height={300}
              className="h-full w-full rounded-lg object-cover"
              unoptimized
            />
          </AspectRatio>

          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="default">
              <Link
                href={`/dashboard/recipe/${selectedRecipe.id}`}
                className="flex gap-1 items-center"
              >
                レシピを見る
              </Link>
            </Button>
            <Button
              type="button"
              onClick={(e) => handleDelete(e)}
              disabled={isPending}
              variant="destructive"
            >
              {isPending && <Spinner />}
              {isPending ? "削除中..." : "削除"}
            </Button>
          </DialogFooter>
        </div>
      )}
    </DialogContent>
  )
}
