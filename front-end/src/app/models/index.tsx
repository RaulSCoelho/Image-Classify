'use client'

import { useCallback, useState } from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { LuEye, LuTrash2 } from 'react-icons/lu'

import { Table } from '@/components/table'
import { TableAction } from '@/components/table/action'
import { useSWRCustom } from '@/hooks/use-swr-custom'
import { AIModel } from '@/types/ai-models'
import { Selection } from '@nextui-org/react'

export function AIModels() {
  const { state: modelsState } = useSWRCustom<AIModel[]>('models/')
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [, setSelectedModel] = useState<AIModel>()
  const [, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view')

  const renderCell = useCallback((model: AIModel, columnKey: keyof AIModel | 'actions') => {
    const onClickAction = (mode: typeof modalMode) => () => {
      setSelectedModel(model)
      setModalMode(mode)
      setIsModalOpen(true)
    }

    if (columnKey === 'actions')
      return (
        <div className="flex items-center justify-around gap-2">
          <TableAction icon={LuEye} tooltip="View" onClick={onClickAction('view')} />
          <TableAction icon={BiEditAlt} tooltip="Edit" onClick={onClickAction('edit')} />
          <TableAction icon={LuTrash2} tooltip="Delete" className="text-danger" />
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

  return (
    <div className="flex flex-col gap-3 p-5 sm:p-16">
      <Table
        aria-label="AI Models table"
        selectionMode="none"
        emptyContent="No models found"
        className="max-h-full"
        items={modelsState.data || []}
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
        filterFields={['id', 'name', 'model_file']}
        renderCell={renderCell}
        initialVisibleColumns={['id', 'name', 'model_file', 'actions']}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        topContent={({ columns, TableSearch, TableColumnSelector }) => (
          <div className="flex items-center justify-between">
            <TableSearch />
            <TableColumnSelector columns={columns} />
          </div>
        )}
        onCellAction={(key, cell) => {
          if (cell === 'actions') return
          const model = modelsState.data?.find(model => String(model.id) === key)
          if (model) {
            setSelectedModel(model)
            setModalMode('view')
            setIsModalOpen(true)
          }
        }}
      />
    </div>
  )
}
