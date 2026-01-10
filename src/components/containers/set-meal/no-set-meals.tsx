import { IconFolderCode } from "@tabler/icons-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NoSetMeals() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>献立がありません</EmptyTitle>
        <EmptyDescription>
          条件を変更するか、新しい献立を作成してみてください。
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
