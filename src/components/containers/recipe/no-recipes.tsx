import { IconFolderCode } from "@tabler/icons-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NoRecipes() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>レシピがありません</EmptyTitle>
        <EmptyDescription>
          条件を変更するか、新しいレシピを作成してみてください。
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
