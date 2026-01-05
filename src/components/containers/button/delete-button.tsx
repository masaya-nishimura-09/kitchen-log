import { IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export default function DeleteButton({ text }: { text: string }) {
  return (
    <Button variant="outline" className="flex gap-2 items-center">
      <IconTrash />
      {text}
    </Button>
  )
}
