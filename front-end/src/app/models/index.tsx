'use client'

import { useCallback, useState } from 'react'

import { Table } from '@/components/table'
import { TableTopContent } from '@/components/table/types'
import { useSWRCustom } from '@/hooks/use-swr-custom'
import { AIModel } from '@/types/ai-models'
import { Selection, Spinner } from '@nextui-org/react'

export function AIModels() {
  const { state: modelsState } = useSWRCustom<AIModel[]>('models/')
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

  const renderCell = useCallback((model: AIModel, columnKey: keyof AIModel) => {
    const cellValue = String(model[columnKey])

    switch (columnKey) {
      case 'name':
        return <p className="font-bold">{cellValue}</p>
      default:
        return cellValue
    }
  }, [])

  const topContent: TableTopContent<AIModel> = useCallback(
    ({ filterFields, columns, TableSearch, TableColumnSelector }) => (
      <div className="flex items-center justify-between gap-2">
        <TableSearch filterFields={filterFields} />
        <TableColumnSelector columns={columns} />
      </div>
    ),
    []
  )

  return (
    <div className="flex flex-col gap-3 p-5 sm:p-16">
      <Table
        aria-label="AI Models table"
        selectionMode="none"
        className="max-h-full"
        items={modelsState.data || []}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        topContent={topContent}
        renderCell={renderCell}
        filterFields={['id', 'name', 'model_file', 'classes_file']}
        initialVisibleColumns={['id', 'name', 'model_file', 'classes_file']}
        bodyProps={{
          emptyContent: modelsState.isLoading ? ' ' : 'No models found',
          isLoading: modelsState.isLoading,
          loadingContent: <Spinner color="primary" />
        }}
        columns={[
          { name: 'ID', uid: 'id', sortable: true },
          { name: 'NAME', uid: 'name', sortable: true },
          { name: 'MODEL', uid: 'model_file', sortable: true },
          { name: 'CLASSES', uid: 'classes_file', sortable: true },
          { name: 'RESIZE', uid: 'resize', sortable: true },
          { name: 'MEAN', uid: 'mean', sortable: true },
          { name: 'STD', uid: 'std', sortable: true }
        ]}
      />
    </div>
  )
}
