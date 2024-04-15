'use client'

import { useMemo } from 'react'

import { useIsMounted } from '@/hooks/use-is-mounted'
import { search } from '@/lib/string'
import { Selection, SortDescriptor } from '@nextui-org/react'
import { atom, useRecoilState, useRecoilValue } from 'recoil'

import { IdField, TableProps } from './types'

interface TableContext<T extends IdField>
  extends Pick<
    TableProps<T>,
    'items' | 'columns' | 'initialVisibleColumns' | 'filterFields' | 'initialSortDescriptor'
  > {}

export const tablePageState = atom({
  key: 'tablePageState',
  default: 1
})

export const tableRowsPerPageState = atom({
  key: 'tableRowsPerPageState',
  default: 10
})

export const tableCloumnsState = atom({
  key: 'tableCloumnsState',
  default: new Set([]) as Selection
})

export const tableSearchState = atom({
  key: 'tableSearchState',
  default: ''
})

export const tableSortDescriptorState = atom({
  key: 'tableSortDescriptorState',
  default: {} as SortDescriptor
})

export function useTableContext<T extends IdField>({
  items,
  columns,
  initialVisibleColumns,
  filterFields,
  initialSortDescriptor
}: TableContext<T>) {
  const page = useRecoilValue(tablePageState)
  const rowsPerPage = useRecoilValue(tableRowsPerPageState)
  const [visibleColumns, setVisibleColumns] = useRecoilState(tableCloumnsState)
  const filterValue = useRecoilValue(tableSearchState)
  const [sortDescriptor, setSortDescriptor] = useRecoilState(tableSortDescriptorState)

  const isMounted = useIsMounted(() => {
    setVisibleColumns(new Set(initialVisibleColumns as any))
    setSortDescriptor(
      initialSortDescriptor || {
        column: 'id' in items ? 'id' : '_id' in items ? '_id' : String(initialVisibleColumns[0]),
        direction: 'ascending'
      }
    )
  })

  const filteredItems = useMemo(() => {
    let filtered = [...items]

    if (filterValue) {
      filtered = search(filtered, filterFields, filterValue)
    }

    return filtered
  }, [filterFields, filterValue, items])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const visibleItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...visibleItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a]
      const second = b[sortDescriptor.column as keyof typeof b]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, visibleItems])

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter(column => Array.from(visibleColumns).includes(column.uid as any))
  }, [columns, visibleColumns])

  return { isMounted, pages, filteredItems, sortedItems, headerColumns }
}
