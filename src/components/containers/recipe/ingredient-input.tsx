"use client"

import type { DragEndEvent } from "@dnd-kit/core"
import {
  closestCenter,
  DndContext,
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
import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Item, ItemActions, ItemContent, ItemMedia } from "@/components/ui/item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { unitList } from "@/lib/recipe/ingredient-unit"
import type { RecipeInput, RecipeState } from "@/types/recipe/recipe-input"

function SortableStepItem({
  ingredient,
  onRemove,
}: {
  ingredient: {
    id: string
    name: string
    amount: string
    unit: string
    order: number
  }
  onRemove: (name: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ingredient.id })

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
          <div className="flex gap-1">
            <span className="break-all">{ingredient.name}</span>
            <span className="break-all">...</span>
            <span className="break-all">{ingredient.amount}</span>
            <span className="break-all">{ingredient.unit}</span>
          </div>
        </ItemContent>
        <ItemActions>
          <button
            type="button"
            className="rounded-full shrink-0"
            onClick={() => onRemove(ingredient.name)}
          >
            <IconCircleX size={18} />
          </button>
        </ItemActions>
      </Item>
    </div>
  )
}

export default function IngredientInput({
  formData,
  setFormDataAction,
  state,
}: {
  formData: RecipeInput
  setFormDataAction: Dispatch<SetStateAction<RecipeInput>>
  state: RecipeState | undefined
}) {
  const [inputValue, setInputValue] = useState({
    name: "",
    amount: "",
    unit: unitList[0].value,
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

    const oldIndex = formData.ingredient.findIndex(
      (item) => item.id === active.id,
    )
    const newIndex = formData.ingredient.findIndex(
      (item) => item.id === over.id,
    )

    const newIngredients = arrayMove(formData.ingredient, oldIndex, newIndex)

    const reorderedIngredients = newIngredients.map((ingredient, index) => ({
      ...ingredient,
      order: index + 1,
    }))

    setFormDataAction({
      ...formData,
      ingredient: reorderedIngredients,
    })
  }

  function handleAddIngredient() {
    const trimmedName = inputValue.name.trim()
    const trimmedAmount = inputValue.amount.trim()

    if (!trimmedName) return

    if (formData.ingredient.some((i) => i.name === trimmedName)) return

    setFormDataAction({
      ...formData,
      ingredient: [
        ...formData.ingredient,
        {
          id: crypto.randomUUID(),
          name: trimmedName,
          amount: trimmedAmount,
          unit: inputValue.unit,
          order: formData.ingredient.length + 1,
        },
      ],
    })
    setInputValue({
      name: "",
      amount: "",
      unit: unitList[0].value,
    })
  }

  function handleRemoveIngredient(name: string) {
    setFormDataAction({
      ...formData,
      ingredient: formData.ingredient.filter((i) => i.name !== name),
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleAddIngredient()
    }
  }

  return (
    <AccordionContent className="grid gap-2 max-w-xl">
      <div className="flex w-full gap-2">
        <div className="flex flex-col w-full items-center gap-2">
          <Input
            id="ingredient-name"
            name="ingredient-name"
            type="text"
            value={inputValue.name}
            onChange={(e) =>
              setInputValue({ ...inputValue, name: e.target.value })
            }
            onKeyDown={handleKeyDown}
            placeholder="材料名を入力してください"
          />
          <div className="flex gap-2 w-full">
            <Input
              id="ingredient-amount"
              name="ingredient-amount"
              type="text"
              value={inputValue.amount}
              onChange={(e) =>
                setInputValue({ ...inputValue, amount: e.target.value })
              }
              onKeyDown={handleKeyDown}
              placeholder="量を入力してください"
            />
            <Select
              defaultValue={inputValue.unit}
              onValueChange={(e) => setInputValue({ ...inputValue, unit: e })}
            >
              <SelectTrigger className="w-30">
                <SelectValue placeholder="単位" />
              </SelectTrigger>
              <SelectContent>
                {unitList.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddIngredient}
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
          items={formData.ingredient.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex w-full flex-col gap-2">
            {formData.ingredient.map((i) => (
              <SortableStepItem
                key={i.id}
                ingredient={i}
                onRemove={handleRemoveIngredient}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div aria-live="polite" aria-atomic="true">
        {state?.errors?.ingredient?.map((error: string) => (
          <p className="mt-2 text-red-500 text-sm" key={error}>
            {error}
          </p>
        ))}
      </div>
    </AccordionContent>
  )
}
