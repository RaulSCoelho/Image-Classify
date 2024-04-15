'use client'

import { useCallback, useState } from 'react'
import { LuEye } from 'react-icons/lu'

import { Table } from '@/components/table'
import { TableAction } from '@/components/table/action'
import { TableTopContent } from '@/components/table/types'
import { useSWRCustom } from '@/hooks/use-swr-custom'
import { AIModel } from '@/types/ai-models'
import { Selection, Spinner } from '@nextui-org/react'

export function AIModels() {
  const { state: modelsState } = useSWRCustom<AIModel[]>('models/')
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [, setSelectedModel] = useState<AIModel>()

  const renderCell = useCallback((model: AIModel, columnKey: keyof AIModel | 'actions') => {
    if (columnKey === 'actions')
      return (
        <div className="flex justify-center">
          <TableAction icon={LuEye} tooltip="View" onClick={() => setSelectedModel(model)} />
        </div>
      )

    const cellValue = String(model[columnKey])

    switch (columnKey) {
      case 'name':
        return <p className="font-bold">{cellValue}</p>
      default:
        return cellValue
    }
  }, [])

  const topContent: TableTopContent<AIModel> = useCallback(
    ({ columns, TableSearch, TableColumnSelector }) => (
      <div className="flex items-center justify-between">
        <TableSearch />
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
        filterFields={['id', 'name', 'model_file']}
        initialVisibleColumns={['id', 'name', 'model_file', 'actions']}
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
          { name: 'STD', uid: 'std', sortable: true },
          { name: 'ACTIONS', uid: 'actions' }
        ]}
        onCellAction={(key, cell) => {
          if (cell === 'actions') return
          const model = modelsState.data?.find(model => String(model.id) === key)
          if (model) {
            setSelectedModel(model)
          }
        }}
      />
    </div>
  )
}
