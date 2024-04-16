'use client'

import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/button'
import { FlexWrap } from '@/components/flex-wrap'
import { Input } from '@/components/input'
import { FileInput } from '@/components/input/file'
import { Modal } from '@/components/modal'
import { Table } from '@/components/table'
import { TableTopContent } from '@/components/table/types'
import { useSWRCustom } from '@/hooks/use-swr-custom'
import { AIModel, AIModelUploadInput, AIModelUploadOutput, aiModelUploadSchema } from '@/types/ai-model'
import { zodResolver } from '@hookform/resolvers/zod'
import { Selection, Spinner } from '@nextui-org/react'

export function AIModels() {
  const { state: modelsState, post } = useSWRCustom<AIModel[]>('models/')
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [isNewModelModalOpen, setIsNewModelModalOpen] = useState(false)
  const { watch, register, setValue, handleSubmit, formState } = useForm<AIModelUploadInput>({
    resolver: zodResolver(aiModelUploadSchema)
  })
  const values = watch()

  const setFile = useCallback(
    (key: 'model_file' | 'classes_file') => (files?: File[]) => {
      setValue(key, files ? files[0] : (undefined as any))
    },
    [setValue]
  )

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
      <FlexWrap className="justify-between">
        <div className="flex gap-2">
          <TableColumnSelector columns={columns} />
          <Button onPress={() => setIsNewModelModalOpen(true)}>New</Button>
        </div>
        <TableSearch filterFields={filterFields} />
      </FlexWrap>
    ),
    []
  )

  async function onSubmit(formData: AIModelUploadOutput) {
    const res = await post<AIModel>(formData, {
      mutate: ({ res, state }) => [...(state || []), res.data]
    })
    res.ok && setIsNewModelModalOpen(false)
  }

  return (
    <div className="p-5 sm:p-16">
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
      <Modal
        title="New AI Model"
        isOpen={isNewModelModalOpen}
        onOpenChange={setIsNewModelModalOpen}
        onFormSubmit={handleSubmit(onSubmit as any)}
        fullScreen={false}
      >
        <Modal.Body>
          <Input label="Name" placeholder="Ex: YourAIModel" {...register('name')} />
          <FileInput label="Model" value={values.model_file} onValueChange={setFile('model_file')} />
          <FileInput label="Classes" value={values.classes_file} onValueChange={setFile('classes_file')} />
          <Input label="Resize (optional)" placeholder="Ex: 224, 244" {...register('resize')} />
          <Input label="Mean (optional)" placeholder="Ex: 0.4708, 0.4602, 0.4550" {...register('mean')} />
          <Input label="STD (optional)" placeholder="Ex: 0.2593, 0.2584, 0.2634" {...register('std')} />
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" color="primary" isLoading={formState.isSubmitting}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
