import { useCallback } from 'react'

import { useRecoilState, useSetRecoilState } from 'recoil'

import { InputProps } from '../input'
import { SearchInput } from '../input/search'
import { tablePageState, tableSearchState } from './context'
import { IdField, TableProps } from './types'

type TableSearchProps<T extends IdField> = Omit<InputProps, 'value' | 'onValueChange' | 'onClear'> & {
  filterFields?: TableProps<T>['filterFields']
}

export function TableSearch<T extends IdField>({
  filterFields,
  placeholder,
  classNames,
  ...props
}: TableSearchProps<T>) {
  const [searchValue, setSearchValue] = useRecoilState(tableSearchState)
  const setPage = useSetRecoilState(tablePageState)

  const onSearchChange = useCallback(
    (value: string) => {
      if (value) {
        setSearchValue(value)
        setPage(1)
      } else {
        setSearchValue('')
      }
    },
    [setPage, setSearchValue]
  )

  const onClear = useCallback(() => {
    setSearchValue('')
    setPage(1)
  }, [setPage, setSearchValue])

  return (
    <SearchInput
      value={searchValue}
      placeholder={placeholder || (filterFields ? `Search by ${filterFields.join(', ')}...` : undefined)}
      classNames={{
        ...classNames,
        base: ['w-full sm:max-w-[44%]', classNames?.base]
      }}
      onValueChange={onSearchChange}
      onClear={onClear}
      {...props}
    />
  )
}
