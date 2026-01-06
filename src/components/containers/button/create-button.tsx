import { IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CreateButton({ link }: { link: string }) {
  return (
    <Button type="button">
      <Link href={link} className="flex items-center gap-2">
        <IconPlus />
        作成
      </Link>
    </Button>
  )
}
