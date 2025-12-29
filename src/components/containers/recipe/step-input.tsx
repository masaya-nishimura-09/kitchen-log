"use client"

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { IconCircleX, IconGripVertical } from "@tabler/icons-react"
import { type Dispatch, type SetStateAction, useState } from "react"
import { AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Textarea } from "@/components/ui/textarea"
import type { RecipeInput, RecipeState } from "@/types/recipe/recipe-input"

function SortableStepItem({
  step,
  onRemove,
}: {
  step: { id: string; text: string; order: number }
  onRemove: (text: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Item variant="outline" size="sm" className="max-w-full">
        <ItemMedia
          className="my-auto cursor-grab active:cursor-grabbing"
          {...listeners}
        >
          <IconGripVertical />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="break-all">{step.text}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <button
            type="button"
            className="rounded-full shrink-0"
            onClick={() => onRemove(step.text)}
          >
            <IconCircleX size={18} />
          </button>
        </ItemActions>
      </Item>
    </div>
  )
}

export default function StepInput({
  formData,
  setFormDataAction,
  state,
}: {
  formData: RecipeInput
  setFormDataAction: Dispatch<SetStateAction<RecipeInput>>
  state: RecipeState | undefined
}) {
  const [inputValue, setInputValue] = useState({
    text: "",
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = formData.step.findIndex((item) => item.id === active.id)
    const newIndex = formData.step.findIndex((item) => item.id === over.id)

    const newSteps = arrayMove(formData.step, oldIndex, newIndex)

    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index + 1,
    }))

    setFormDataAction({
      ...formData,
      step: reorderedSteps,
    })
  }

  function handleAddStep() {
    const trimmed = inputValue.text.trim()

    if (!trimmed) return

    if (formData.step.some((i) => i.text === trimmed)) return

    setFormDataAction({
      ...formData,
      step: [
        ...formData.step,
        {
          id: crypto.randomUUID(),
          text: trimmed,
          order: formData.step.length + 1,
        },
      ],
    })
    setInputValue({
      text: "",
    })
  }

  function handleRemoveStep(name: string) {
    setFormDataAction({
      ...formData,
      step: formData.step.filter((i) => i.text !== name),
    })
  }

  return (
    <AccordionContent className="grid gap-2 max-w-xl">
      <div className="flex w-full items-center gap-2">
        <Textarea
          id="step"
          name="step"
          value={inputValue.text}
          onChange={(e) =>
            setInputValue({ ...inputValue, text: e.target.value })
          }
          placeholder="手順を入力してください"
          className="break-all w-full"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddStep}
          className="mt-auto"
        >
          追加
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={formData.step.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex w-full flex-col gap-2">
            {formData.step.map((s) => (
              <SortableStepItem
                key={s.id}
                step={s}
                onRemove={handleRemoveStep}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div aria-live="polite" aria-atomic="true">
        {state?.errors?.step?.map((error: string) => (
          <p className="mt-2 text-red-500 text-sm" key={error}>
            {error}
          </p>
        ))}
      </div>
    </AccordionContent>
  )
}
