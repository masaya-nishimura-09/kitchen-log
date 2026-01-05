import { IconCaretRight } from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SeeMoreButton({ link }: { link: string }) {
  return (
    <Button variant="default">
      <Link href={link} className="flex gap-1 items-center">
        もっと見る
        <IconCaretRight />
      </Link>
    </Button>
  )
}
