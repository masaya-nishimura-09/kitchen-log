"use client"

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useState, useTransition } from "react"
import { deleteItem, deleteItems } from "@/actions/shopping-list/delete"
import { updateItem } from "@/actions/shopping-list/update"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ShoppingListItem } from "@/types/shopping-list/shopping-list-item"

export const columns: ColumnDef<ShoppingListItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "名前",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "amount",
    header: "量",
    cell: ({ row }) => <div>{row.getValue("amount")}</div>,
  },
  {
    accessorKey: "unit",
    header: "単位",
    cell: ({ row }) => <div>{row.getValue("unit")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [isPending, startTransition] = useTransition()
      const item = row.original
      async function handleDeleteItem() {
        startTransition(async () => {
          const result = await deleteItem(item.id)
          if (result.success) {
            window.location.reload()
          } else {
            console.error(result.message)
          }
        })
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  削除
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>アイテムの削除</AlertDialogTitle>
                  <AlertDialogDescription>
                    このアイテムを本当に削除してもよろしいですか？
                    この操作は元に戻せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteItem}>
                    {isPending && <Spinner />}
                    OK
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function ShoppingListTable({
  status,
  items,
}: {
  status: string
  items: ShoppingListItem[]
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: items || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const [isUpdatePending, startUpdateTransition] = useTransition()
  const [isDeletePending, startDeleteTransition] = useTransition()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    const originalData = table
      .getFilteredSelectedRowModel()
      .rows.map((i) => i.original)

    const fd = new FormData()

    fd.append("shoppingListItemData", JSON.stringify(originalData))

    startUpdateTransition(async () => {
      const result = await updateItem(fd)
      if (result.success) {
        window.location.reload()
      } else {
        console.error(result.message)
      }
    })
  }

  const handleDeleteItems = async (e: React.FormEvent) => {
    e.preventDefault()

    const originalData = table
      .getFilteredSelectedRowModel()
      .rows.map((i) => i.original)

    const fd = new FormData()

    fd.append("shoppingListItemData", JSON.stringify(originalData))

    startDeleteTransition(async () => {
      const result = await deleteItems(fd)
      if (result.success) {
        window.location.reload()
      } else {
        console.error(result.message)
      }
    })
  }

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  アイテムがありません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col items-center justify-end gap-2 py-4 md:flex-row">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="flex gap-2 text-muted-foreground flex-1 text-sm">
            <Button
              variant="outline"
              onClick={handleUpdate}
              disabled={isUpdatePending}
            >
              {isUpdatePending && <Spinner />}
              {isUpdatePending
                ? "変更中..."
                : status === "done"
                  ? `${table.getFilteredSelectedRowModel().rows.length}個を未購入にする`
                  : `${table.getFilteredSelectedRowModel().rows.length}個を購入済にする`}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteItems}
              disabled={isDeletePending}
            >
              {isDeletePending && <Spinner />}
              {isDeletePending
                ? "削除中..."
                : `${table.getFilteredSelectedRowModel().rows.length}個を削除する`}
            </Button>
          </div>
        )}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            前へ
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            次へ
          </Button>
        </div>
      </div>
    </div>
  )
}
